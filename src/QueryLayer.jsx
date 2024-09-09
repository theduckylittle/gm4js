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

const cmykToRGB = (cmyk, alpha = 1.0) => {
  const black = 1 - cmyk[3] / 100;
  const red = 255 * ((1 - cmyk[0] / 100) * black);
  const green = 255 * ((1 - cmyk[1] / 100) * black);
  const blue = 255 * ((1 - cmyk[2] / 100) * black);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const SELECTION_COLORS = {
  blue: cmykToRGB([20, 5, 0, 20]),
  blue_fill: cmykToRGB([20, 5, 0, 0], 0.3),
  green: cmykToRGB([10, 0, 50, 0]),
  yellow: cmykToRGB([0, 10, 100, 0]),
  tan: cmykToRGB([0, 20, 50, 10]),
  tan_fill: cmykToRGB([0, 20, 50, 0], 0.1),
  grey: cmykToRGB([0, 0, 0, 25], 0.8),
};

const makeStyle = (isPreview) => {
  if (isPreview) {
    return {
      "fill-color": SELECTION_COLORS.blue_fill,
      "stroke-color": SELECTION_COLORS.blue,
      "stroke-width": 3,
      "circle-radius": 5,
      "circle-fill-color": SELECTION_COLORS.blue_fill,
      "circle-stroke-width": 1.25,
      "circle-stroke-color": SELECTION_COLORS.blue,
    };
  }

  return {
    "fill-color": SELECTION_COLORS.tan_fill,
    "stroke-color": SELECTION_COLORS.tan,
    "stroke-width": 3,
    "circle-radius": 5,
    "circle-fill-color": SELECTION_COLORS.tan_fill,
    "circle-stroke-width": 1.25,
    "circle-stroke-color": SELECTION_COLORS.tan,
  };
};

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
    <VectorLayer style={makeStyle(isPreview)}>
      <VectorSource features={features} />
    </VectorLayer>
  );
};

QueryLayer.propTypes = {
  isPreview: PropTypes.bool,
};
