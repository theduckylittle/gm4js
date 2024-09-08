import VectorLayer from "@planet/maps/layer/VectorTile";
import VectorTileSource from "@planet/maps/source/VectorTile";
import { intersects } from "ol/extent";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef } from "react";

import { useLayerStore } from "./stores/layers";
import { useQueryStore } from "./stores/query";

export const ParquetLayer = ({ layerId, styleFn, ...rest }) => {
  const [selectedFeatures] = useQueryStore((state) => [
    state.selectedFeatures[layerId] || [],
  ]);
  const [features] = useLayerStore((state) => [state.features[layerId] || []]);

  const vectorSourceRef = useRef(null);

  useEffect(() => {
    if (vectorSourceRef.current) {
      const src = vectorSourceRef.current;
      src.clear();
      src.addFeatures(features);
    }
  }, [features]);

  const layerStyle = useCallback(
    (feature) => {
      const isSelected =
        selectedFeatures && selectedFeatures.includes(feature.getId());
      return styleFn(isSelected);
    },
    [selectedFeatures, styleFn],
  );

  return (
    <VectorLayer
      key={`features-${features.length}`}
      style={layerStyle}
      {...rest}
    >
      <VectorTileSource
        options={{
          // need to fake a URL for OpeLayers to trigger any loads.
          url: "http://geomoose.fake/{z}/{x}/{y}",
          tileLoadFunction: function (tile) {
            tile.setLoader((extent) => {
              const tileFeatures = features.filter((feature) =>
                intersects(feature.getGeometry().getExtent(), extent),
              );
              return new Promise((resolve) => {
                tile.setFeatures(tileFeatures);
                resolve();
              });
            });
          },
        }}
      />
    </VectorLayer>
  );
};

ParquetLayer.propTypes = {
  layerId: PropTypes.string,
  styleFn: PropTypes.func,
};
