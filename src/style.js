import { Circle, Fill, Icon, Stroke, Style } from "ol/style";

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

const HIGHLIGHT_COLOR = "255,252,133";

export const makeStyle = (color, fill = true) => {
  const styleFn = (isSelected) => {
    const cacheKey = makeCacheKey(color, isSelected);

    if (!STYLE_CACHE[cacheKey]) {
      const primaryColor = !isSelected ? color : HIGHLIGHT_COLOR;
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

/*
 * The icon resolver will work with the GitHub version of the hosted
 * Maki and Temaki icons or a URL. This allows users to simply *name* an icon.
 * Order of operations:
 *  - `tamaki:` will parse the icon name after the colon and use that as the icon name.
 *  - `http...` or `.[png,jpg,svg]` will return the icon as a url
 *  - `maki:` or an empty icon name will return the path to the maki icon.
 */
const resolveIcon = (icon) => {
  if (icon.startsWith("temaki:")) {
    const iconName = icon.split("temaki:")[1];
    return `https://raw.githubusercontent.com/rapideditors/temaki/main/icons/${iconName}.svg`;
    // this is likely a URL
  } else if (
    icon.startsWith("http") ||
    icon.endsWith(".png") ||
    icon.endsWith(".jpg") ||
    icon.endsWith(".svg")
  ) {
    return icon;
  }

  // by default try to pull an icon from Maki
  const iconName = icon.startsWith("maki:") ? icon.split("maki")[1] : icon;
  return `https://raw.githubusercontent.com/mapbox/maki/main/icons/${iconName}.svg`;
};

export const makePointStyle = (styleDef, color) => {
  const styleFn = (isSelected) => {
    const cacheKey = makeCacheKey(color + "-icon", isSelected);

    if (!STYLE_CACHE[cacheKey]) {
      const primaryColor = !isSelected ? color : HIGHLIGHT_COLOR;
      const iconSize = styleDef.size || 32;
      const iconMargin = 2;

      const styles = [
        // make a nice circle backer for the icon
        new Style({
          image: new Circle({
            radius: iconSize / 2,
            fill: new Fill({
              color: `rgb(${primaryColor})`,
            }),
            stroke: new Stroke({
              width: 3,
              color: "rgba(0,0,0,0.2)",
            }),
          }),
        }),
      ];

      if (styleDef.icon) {
        styles.push(
          new Style({
            image: new Icon({
              src: resolveIcon(styleDef.icon),
              crossOrigin: "anonymous",
              height: iconSize - 2 * iconMargin,
            }),
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
