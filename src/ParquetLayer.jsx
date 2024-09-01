import { useCallback, useRef, useState, useEffect } from "react";
import PropTypes from 'prop-types';

import WKB from "ol/format/WKB";
import Feature from "ol/Feature";

import VectorLayer from "@planet/maps/layer/Vector";
import VectorSource from "@planet/maps/source/Vector";

import ArrowWorker from "./ArrowWorker?worker";

export const ParquetLayer = ({layerId, url, geometryColumn, styleFn, filterSet, ...rest}) => {
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const vectorSourceRef = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    const worker = new ArrowWorker();
    workerRef.current = worker;
    worker.onmessage = evt => {
      if (evt.data.type === "features-ready") {
        const wkb = new WKB();
        setFeatures(evt.data.features.map(({id, geometry}) => {
          const feature = new Feature({
            geometry: wkb.readGeometry(geometry),
          });
          feature.setId(id);
          return feature;
        }));
      } else if (evt.data.type === "table-ready") {
        worker.postMessage({
          type: "load-features",
          column: geometryColumn,
        });
      } else if (evt.data.type === "query-ready") {
        // setSelectedFeatures(layerId, evt.data.results);
        setSelectedFeatures(evt.data.results);
      }
    }
    worker.postMessage({
      type: "load-table",
      url,
    });
  }, [url, geometryColumn, layerId, setSelectedFeatures]);

  useEffect(() => {
    if (vectorSourceRef.current) {
      const src = vectorSourceRef.current;
      src.clear();
      src.addFeatures(features);
    }
  }, [features]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "execute-query",
        query: filterSet,
      });
    }
  }, [filterSet]);

  const layerStyle = useCallback(feature => {
    const isSelected = selectedFeatures && (selectedFeatures.includes(feature.getId()));
    return styleFn(isSelected);
  }, [selectedFeatures, styleFn]);

  return (
    <VectorLayer style={layerStyle} {...rest}>
      <VectorSource ref={vectorSourceRef} />
    </VectorLayer>
  );
}

ParquetLayer.propTypes = {
  layerId: PropTypes.string,
  url: PropTypes.string,
  geometryColumn: PropTypes.string,
  selectedFeatures: PropTypes.object,
  filterSet: PropTypes.object,
  // setSelectedFeatures: PropTypes.func,
  styleFn: PropTypes.func,
};

ParquetLayer.defaultProps = {
  // selectedFeatures: {},
  // setSelectedFeatures: () => {},
};
