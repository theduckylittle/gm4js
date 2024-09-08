import PropTypes from 'prop-types';
import TileLayer from "@planet/maps/layer/WebGLTile";
import OSM from "@planet/maps/source/OSM";
import XYZSource from "@planet/maps/source/XYZ";
import GeoTiff from "@planet/maps/source/GeoTIFF";

import { ParquetLayer } from "./ParquetAsTiles";

import { getStyle } from "./style";

export const Layer = ({layer}) => {
  // if the layer is not on, do nothing
  if (!layer.on) {
    return false;
  }

  if (layer.type === 'osm') {
    return (
      <TileLayer>
        <OSM />
      </TileLayer>
    );
  } else if (layer.type === 'xyz') {
    // this assumes a raster xyz layer
    return (
      <TileLayer>
        <XYZSource
          url={layer.url}
        />
      </TileLayer>
    );
  } else if (layer.type === 'parquet') {
    // TODO: Maybe this should sniff the first geometry to
    //       understand the geometry type for styling.
    return (
      <ParquetLayer
        url={layer.url}
        layerId={layer.id}
        styleFn={getStyle(layer.style)}
        geometryColumn="geometry"
      />
    );
  } else if (layer.type === "cog") {
    return (
      <TileLayer>
        <GeoTiff
          options={{
            convertToRGB: true,
            sources: [
              {
                url: layer.url,
              },
            ],
          }}
        />
      </TileLayer>
    );
  }

  // the layer does not have a match to be rendered, so render nothing.
  // TODO: Should this output something to the console for debugging?
  return false;
}

Layer.propTypes = {
  layer: PropTypes.object,
};
