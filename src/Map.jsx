import axios from "axios";
import { useCallback, useRef, useState, useEffect } from "react";
import { Type, tableFromIPC } from 'apache-arrow';
import Map from "@planet/maps/Map";

import TileLayer from "@planet/maps/layer/WebGLTile";
import OSM from "@planet/maps/source/OSM";
import View from '@planet/maps/View';
import WKB from "ol/format/WKB";
import Feature from "ol/Feature";

import VectorLayer from "@planet/maps/layer/Vector";
import VectorSource from "@planet/maps/source/Vector";
import { Fill, Stroke, Style } from "ol/style";

import ArrowWorker from "./ArrowWorker?worker";

import init, * as parquet from "../node_modules/parquet-wasm/esm/parquet_wasm";
import wasm from "../node_modules/parquet-wasm/esm/parquet_wasm_bg.wasm?url";

const encodeId = (dsId, fId) => {
  return `@${dsId}-${fId}`;
}

export const GeoMooseMap = () => {
  const [features, setFeatures] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [dataTable, setDataTable] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const vectorSourceRef = useRef(null);

  useEffect(() => {
    const worker = new ArrowWorker();
    const wkb = new WKB();
    worker.onmessage = evt => {
      console.log('worker evt=', evt);
      if (evt.data.type === "features-ready") {
        setFeatures(evt.data.features.map(({id, geometry}) => {
          const feature = new Feature({
            geometry: wkb.readGeometry(geometry),
          });
          feature.setId(id);
          return feature;
        }));
      }
    }
    worker.postMessage({});
  }, []);

  /*
  useEffect(() => {
    const wkb = new WKB();

    init(wasm)
      .then(() => {
        return axios.get('./ramsey/plan_taxparcel_4326.geoparquet', {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/x-binary',
            'Accept': 'application/octet-stream, application/x-binary',
          },
        });
      })
      .then(response => {
        const arrowBytes = parquet.readParquet(new Uint8Array(response.data));
        const table = tableFromIPC(arrowBytes.intoIPCStream());

        const geometryColumn = table.getChild("geom");
        const features = [];
        geometryColumn.data.forEach((dataSet, dsIdx) => {
          const offsets = dataSet.valueOffsets;
          for (let i = 1, ii = offsets.length; i < ii; i++) {
            const [start, end] = [offsets[i - 1], offsets[i]]; 
            const geometry = wkb.readGeometry(dataSet.values.slice(start, end));
            const feature = new Feature({
              geometry,
            });

            feature.setId(encodeId(dsIdx, i - 1));
            features.push(feature);
          }
        });
        setFeatures(features);
        setDataTable(table);
      });
  }, []);
  */

  useEffect(() => {
    if (vectorSourceRef.current) {
      const src = vectorSourceRef.current;
      src.clear();
      src.addFeatures(features);
    }
  }, [features, vectorSourceRef.current]);

  const doSearch = () => {
    const fieldDefs = dataTable.schema.fields.filter(field => field.type.typeId === Type.Utf8 || field.type.typeId === Type.LargeUtf8);
    const decoder = new TextDecoder();
    const queryString = searchString.toLowerCase();
    const matchingIndexes = {};
    fieldDefs.forEach(fieldDef => {
      const field = dataTable.getChild(fieldDef.name);
      field.data.forEach((dataSet, dsIdx) => {
        if (!matchingIndexes[dsIdx]) {
          matchingIndexes[dsIdx] = {};
        }

        const offsets = dataSet.valueOffsets;
        for (let i = 1, ii = offsets.length; i < ii; i++) {
          const [start, end] = [offsets[i - 1], offsets[i]]; 
          const asUtf = decoder.decode(dataSet.values.slice(start, end));
          // do the string comparison
          if (asUtf.toLowerCase().includes(queryString)) {
            matchingIndexes[dsIdx][i - 1] = true;
          }
        }
      });
    });

    // flatten this for faster indexing.
    const matches = [];
    Object.keys(matchingIndexes).forEach(dsId => {
      Object.keys(matchingIndexes[dsId]).forEach(idx => {
        matches.push(encodeId(dsId, idx));
      });
    });
    console.log('matches=', matches);

    setSelectedFeatures(matches);
  }

  const styleFn = useCallback(feature => {
    const isSelected = (selectedFeatures.includes(feature.getId()));
    const primaryColor = !isSelected ? "159,219,187" : "255,252,133";
    const strokeWidth = !isSelected ? 3 : 4;
    const zIndex = !isSelected ? 1 : 100;

    return [
      new Style({
        stroke: new Stroke({
          width: strokeWidth,
          color: `rgb(${primaryColor})`,
        }),
        zIndex: zIndex + 2,
      }),
      new Style({
        stroke: new Stroke({
          width: strokeWidth + 2,
          color: "rgba(0,0,0,0.2)",
        }),
        zIndex: zIndex + 1,
      }),
      new Style({
        fill: new Fill({
          color: `rgba(${primaryColor}, 0.1)`,
        }),
        zIndex,
      }),
    ];
  }, [selectedFeatures]);

  return (
    <>
      <div>
        <input onChange={evt => setSearchString(evt.target.value)} value={searchString}
          onKeyPress={evt => {
            if (evt.key === 'Enter') {
              doSearch();
            }
          }}
        />
        <button
          onClick={doSearch}
        >
          Search parcels
        </button>
      </div>
      <div>
        <Map style={{width: 600, height: 400}}>
          <View options={{center: [-93, 45], zoom: 10}} />
          {
            <TileLayer>
              <OSM />
            </TileLayer>
          }
          <VectorLayer minZoom={15} style={styleFn}>
            <VectorSource ref={vectorSourceRef} />
          </VectorLayer>
        </Map>
      </div>
    </>
  );
}
