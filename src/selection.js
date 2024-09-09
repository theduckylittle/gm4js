import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";

import buffer from "@turf/buffer";

import { convertLength } from "./units";

// Combine the selectionFeatures and the buffer settings
// to create the query features
export const transformSelectionFeatures = (
  selectionFeatures,
  bufferSettings,
) => {
  if (selectionFeatures.length === 0) {
    return [];
  }

  return selectionFeatures
    .map((selectionFeature) => {
      const geom = selectionFeature.getGeometry();

      const format = new GeoJSON();
      const geomObject = format.writeGeometryObject(geom);

      const bufferGeomObject = buffer(
        geomObject,
        convertLength(bufferSettings.distance, bufferSettings.units, "m"),
        {
          units: "meters",
        },
      );

      if (!bufferGeomObject) {
        return null;
      }

      const bufferGeom = format.readGeometry(bufferGeomObject.geometry);
      return new Feature({
        geometry: bufferGeom,
      });
    })
    .filter((f) => !!f);
};
