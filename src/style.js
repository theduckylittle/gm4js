import { Fill, Stroke, Style } from "ol/style";

// the style cache is used for individual styles and changes,
//  e.g. selected vs not.
const STYLE_CACHE = {};

// NAMED_STYLES are the name of the styles
const NAMED_STYLES = {};

// the construction of the cache key is pretty arbitrary,
//  but does make this more efficient, memory wise, than
//  creating a bunch of individual style functions.
const makeCacheKey = (color, isSelected) => {
  return `st${color}.${isSelected ? "_" : ""}`;
};

let STYLE_INDEX = 0;
const makeStyleName = () => {
  STYLE_INDEX++;
  return `style-${STYLE_INDEX}`;
};

export const makeStyle = (color, fill = true) => {
  const styleFn = (isSelected) => {
    const cacheKey = makeCacheKey(color, isSelected);

    if (!STYLE_CACHE[cacheKey]) {
      const primaryColor = !isSelected ? color : "255,252,133";
      const strokeWidth = !isSelected ? 3 : 4;
      const zIndex = !isSelected ? 1 : 100;

      const styles = [
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
      ];

      if (fill) {
        styles.push(
          new Style({
            fill: new Fill({
              color: `rgba(${primaryColor}, 0.1)`,
            }),
            zIndex,
          }),
        );
      }
      STYLE_CACHE[cacheKey] = styles;
    }

    return STYLE_CACHE[cacheKey];
  };

  const styleName = makeStyleName();
  NAMED_STYLES[styleName] = styleFn;
  return styleName;
};

export const getStyle = (styleName) => {
  return NAMED_STYLES[styleName];
};
