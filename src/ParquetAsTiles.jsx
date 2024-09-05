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
  const [filterSet, selectedFeatures] = useQueryStore(state => (
    [
      state.filterSet,
      state.selectedFeatures[layerId] || [],
    ]
  ));
  const [features] = useLayerStore(state => ([
    state.features[layerId] || [],
  ]));

  const vectorSourceRef = useRef(null);

  useEffect(() => {
    if (vectorSourceRef.current) {
      const src = vectorSourceRef.current;
      src.clear();
      src.addFeatures(features);
    }
  }, [features]);

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
