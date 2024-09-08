/*
 * Manage workers for the parquet layers.
 */
import Feature from "ol/Feature";
import WKB from "ol/format/WKB";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

import ArrowWorker from "./ArrowWorker?worker";
import { useLayerStore } from "./stores/layers";
import { useQueryStore } from "./stores/query";

const createWorker = (
  layer,
  filterSet,
  setFeatures,
  setSelectedFeatures,
  setFeatureData,
) => {
  const layerId = layer.id;
  const worker = new ArrowWorker();
  worker.onmessage = (evt) => {
    if (evt.data.type === "features-ready") {
      const wkb = new WKB();
      setFeatures(
        layerId,
        evt.data.features.map(({ id, geometry }) => {
          const feature = new Feature({
            geometry: wkb.readGeometry(geometry, {
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            }),
          });
          feature.setId(id);
          return feature;
        }),
      );
    } else if (evt.data.type === "table-ready") {
      worker.postMessage({
        type: "load-features",
        column: layer.geometryColumn || "geometry",
      });
    } else if (evt.data.type === "query-ready") {
      setSelectedFeatures(layerId, evt.data.results);

      // TODO: Verify which columns should need loaded,
      //       this version loads everything for all layers
      worker.postMessage({
        type: "load-data",
        indexes: evt.data.results,
        columns: "*",
      });
    } else if (evt.data.type === "data-ready") {
      setFeatureData(layerId, evt.data.results);
    }
  };
  worker.postMessage({
    type: "load-table",
    url: layer.url,
  });

  return worker;
};

export const LayerProvider = ({ children }) => {
  const workers = useRef({});
  const [layers, setFeatures] = useLayerStore((state) => [
    state.layers,
    state.setFeatures,
  ]);
  const [filterSet, setSelectedFeatures, setFeatureData] = useQueryStore(
    (state) => [
      state.filterSet,
      state.setSelectedFeatures,
      state.setFeatureData,
    ],
  );

  useEffect(() => {
    const nextWorkers = {};
    layers.forEach((layer) => {
      const layerId = layer.id;
      if (layer.on) {
        if (workers.current[layerId]) {
          nextWorkers[layerId] = workers.current[layerId];
        } else {
          // need to create a new worker
          nextWorkers[layerId] = createWorker(
            layer,
            filterSet,
            setFeatures,
            setSelectedFeatures,
            setFeatureData,
          );
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
    Object.keys(workers.current).forEach((layerId) => {
      workers.current[layerId].postMessage({
        type: "execute-query",
        query: filterSet,
      });
    });
  }, [layers, filterSet, setFeatures, setSelectedFeatures, setFeatureData]);

  return children;
};

LayerProvider.propTypes = {
  children: PropTypes.node,
};
