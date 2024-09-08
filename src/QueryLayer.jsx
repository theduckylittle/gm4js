// The query layer depicts the selection feature as it
//  will be searched against the dataset.
// This is more or less "selection feature" + buffer settings.
//
import VectorLayer from "@planet/maps/layer/Vector";
import VectorSource from "@planet/maps/source/Vector";
import PropTypes from "prop-types";
import { useMemo } from "react";

import { transformSelectionFeatures } from "./selection";
import { useMapStore } from "./stores/map";
import { useQueryStore } from "./stores/query";

export const QueryLayer = ({ isPreview = false }) => {
  const [selectionFeatures, queryFeatures] = useQueryStore((state) => [
    state.selectionFeatures,
    state.queryFeatures,
  ]);
  const [bufferSettings] = useMapStore((state) => [state.bufferSettings]);

  const features = useMemo(() => {
    if (!isPreview) {
      return queryFeatures;
    }

    if (bufferSettings.distance === 0) {
      // there is no modification, so do not render anything
      return [];
    }
    return transformSelectionFeatures(selectionFeatures, bufferSettings);
  }, [isPreview, queryFeatures, selectionFeatures, bufferSettings]);

  return (
    <VectorLayer>
      <VectorSource features={features} />
    </VectorLayer>
  );
};

QueryLayer.propTypes = {
  isPreview: PropTypes.bool,
};
