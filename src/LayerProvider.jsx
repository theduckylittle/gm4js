/*
 * Manage workers for the parquet layers.
 */
import { useRef, useEffect, useState } from "react";
import { useLayerStore } from "./stores/layers";
import { useQueryStore } from "./stores/query";
import PropTypes from 'prop-types';
import ArrowWorker from "./ArrowWorker?worker";

import WKB from 'ol/format/WKB';
import Feature from 'ol/Feature';

const isParquet = layer => layer.type === 'parquet';


const createWorker = (layer, filterSet, setFeatures, setSelectedFeatures) => {
  const layerId = layer.id;
  const worker = new ArrowWorker();
  worker.onmessage = evt => {
    if (evt.data.type === "features-ready") {
      const wkb = new WKB();
      setFeatures(layerId, evt.data.features.map(({id, geometry}) => {
        const feature = new Feature({
          geometry: wkb.readGeometry(geometry, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          }),
        });
        feature.setId(id);
        return feature;
      }));
    } else if (evt.data.type === "table-ready") {
      worker.postMessage({
        type: "load-features",
        column: layer.geometryColumn || "geometry",
      });
    } else if (evt.data.type === "query-ready") {
      setSelectedFeatures(layerId, evt.data.results);
    }
  }
  worker.postMessage({
    type: "load-table",
    url: layer.url,
  });

  return worker;
}

export const LayerProvider = ({children}) => {
  const workers = useRef({});
  const [layers, setFeatures] = useLayerStore(state => [
    state.layers,
    state.setFeatures,
  ]);
  const [filterSet, setSelectedFeatures] = useQueryStore(state => (
    [
      state.filterSet,
      state.setSelectedFeatures,
    ]
  ));

  useEffect(() => {
    const layersOn = layers.filter(layer => !!layer.on && isParquet(layer));
    const nextWorkers = {};
    layers.forEach(layer => {
      const layerId = layer.id;
      if (layer.on) {
        if (workers.current[layerId]) {
          nextWorkers[layerId] = workers.current[layerId];
        } else {
          // need to create a new worker
          nextWorkers[layerId] = createWorker(layer, filterSet, setFeatures, setSelectedFeatures);
        }
      } else {
        // handle layers that are off but were on.
        if (workers.current[layerId]) {
          setFeatures(layerId, []);
          setSelectedFeatures(layerId, []);
          delete workers.current[layerId];
        }
      }
    });
    workers.current = nextWorkers;

    // update the query filter for each layer
    Object.keys(workers.current).forEach(layerId => {
      workers.current[layerId].postMessage({
        type: "execute-query",
        query: filterSet,
      });
    });

  }, [layers, filterSet, setFeatures, setSelectedFeatures]);

  return children;
}

LayerProvider.propTypes = {
  children: PropTypes.node,
};
