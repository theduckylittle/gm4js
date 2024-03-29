import { useRef, useState, useEffect } from "react";
import { Type, tableFromIPC } from 'apache-arrow';
import Map from "@planet/maps/Map";

import TileLayer from "@planet/maps/layer/WebGLTile";
import OSM from "@planet/maps/source/OSM";
import View from '@planet/maps/View';
import WKB from "ol/format/WKB";
import WKT from "ol/format/WKT";
import Feature from "ol/Feature";

import VectorLayer from "@planet/maps/layer/Vector";
import VectorSource from "@planet/maps/source/Vector";

// import parquet from "parquet-wasm";
//
import * as arrow from "apache-arrow";

import init, * as parquet from "../node_modules/parquet-wasm/esm/parquet_wasm";
import wasm from "../node_modules/parquet-wasm/esm/parquet_wasm_bg.wasm?url";


export const GeoMooseMap = () => {
  const [features, setFeatures] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [dataTable, setDataTable] = useState(null);
  const vectorSourceRef = useRef(null);

  useEffect(() => {
    const wkb = new WKB();
    const wkt = new WKT();

    init(wasm)
      .then(() => {
        return fetch('./parcels.geoparquet')
      })
      .then(r => r.arrayBuffer())
      .then(bytes => {
        const arrowBytes = parquet.readParquet(new Uint8Array(bytes));
        const table = arrow.tableFromIPC(arrowBytes.intoIPCStream());

        const geometryColumn = table.getChild("geometry");
        const features = [];
        geometryColumn.data.forEach(dataSet => {
          const offsets = dataSet.valueOffsets;
          for (let i = 1, ii = offsets.length; i < ii; i++) {
            const [start, end] = [offsets[i - 1], offsets[i]]; 
            const geometry = wkb.readGeometry(dataSet.values.slice(start, end));
            features.push(new Feature({
              geometry,
            }));
          }
        });
        setFeatures(features);
        setDataTable(table);
      });
  }, []);

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
        matches.push([dsId, idx]);
      });
    });
    console.log('matches=', matches);

  }

  return (
    <>
      <div>
        <input onChange={evt => setSearchString(evt.target.value)} value={searchString} />
        <button
          onClick={doSearch}
        >
          Search parcels
        </button>
      </div>
      <div>
        <Map style={{width: 600, height: 400}}>
          <View options={{center: [-93, 44.5], zoom: 10}} />
          <VectorLayer>
            <VectorSource ref={vectorSourceRef} />
          </VectorLayer>
          {/*
          <TileLayer>
            <OSM />
          </TileLayer>
          */}
        </Map>
      </div>
    </>
  );
}
