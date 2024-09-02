import { useCallback, useRef, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { intersects } from "ol/extent";

import { useLayerStore } from "./stores/layers";
import { useQueryStore } from "./stores/query";

import WKB from "ol/format/WKB";
import Feature from "ol/Feature";

import VectorLayer from "@planet/maps/layer/VectorTile";
import VectorTileSource from "@planet/maps/source/VectorTile";

import ArrowWorker from "./ArrowWorker?worker";

export const ParquetLayer = ({layerId, url, geometryColumn, styleFn, ...rest}) => {
  const [filterSet, selectedFeatures, setSelectedFeatures] = useQueryStore(state => (
    [
      state.filterSet,
      state.selectedFeatures[layerId] || [],
      state.setSelectedFeatures,
    ]
  ));
  const [features] = useLayerStore(state => ([
    state.features[layerId] || [],
  ]));

  // const [features, setFeatures] = useState([]);
  // const [selectedFeatures, setSelectedFeatures] = useState([]);
  const vectorSourceRef = useRef(null);
  /*
  const workerRef = useRef(null);

  useEffect(() => {
    // the result of this is the establishment of the worker-ref
    if (!workerRef.current) {
      const worker = new ArrowWorker();
      workerRef.current = worker;
      worker.onmessage = evt => {
        if (evt.data.type === "features-ready") {
          const wkb = new WKB();
          setFeatures(evt.data.features.map(({id, geometry}) => {
            const feature = new Feature({
              geometry: wkb.readGeometry(geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
              }),
            });
            feature.setId(id);
            return feature;
          }));
          // send the query to ensure that any pre-existing query is executed on load
          workerRef.current.postMessage({
            type: "execute-query",
            query: filterSet,
          });
        } else if (evt.data.type === "table-ready") {
          worker.postMessage({
            type: "load-features",
            column: geometryColumn,
          });
        } else if (evt.data.type === "query-ready") {
          setSelectedFeatures(layerId, evt.data.results);
        }
      }
      worker.postMessage({
        type: "load-table",
        url,
      });
    }
  }, [url, geometryColumn, layerId, setSelectedFeatures, filterSet]);
  */

  useEffect(() => {
    if (vectorSourceRef.current) {
      const src = vectorSourceRef.current;
      src.clear();
      src.addFeatures(features);
    }
  }, [features]);
  /*

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "execute-query",
        query: filterSet,
      });
    }
  }, [filterSet]);
  */

  const layerStyle = useCallback(feature => {
    const isSelected = selectedFeatures && (selectedFeatures.includes(feature.getId()));
    return styleFn(isSelected);
  }, [selectedFeatures, styleFn]);

  return (
    <VectorLayer
      key={`features-${features.length}`}
      style={layerStyle} 
      {...rest}
    >
      <VectorTileSource
        options={{
          // need to fake a URL for OpeLayers to trigger any loads.
          url: 'http://geomoose.fake/{z}/{x}/{y}',
          tileLoadFunction: function(tile) {
            tile.setLoader((extent) => {
              const tileFeatures = features.filter(feature => intersects(feature.getGeometry().getExtent(), extent));
              return new Promise(resolve => {
                tile.setFeatures(tileFeatures);
                resolve();
              });
            });
          },
        }}
      />
    </VectorLayer>
  );
}

ParquetLayer.propTypes = {
  layerId: PropTypes.string,
  url: PropTypes.string,
  geometryColumn: PropTypes.string,
  styleFn: PropTypes.func,
};

ParquetLayer.defaultProps = {
  // selectedFeatures: {},
  // setSelectedFeatures: () => {},
};
