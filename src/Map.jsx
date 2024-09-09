import DrawInteraction from "@planet/maps/interaction/Draw";
import Map from "@planet/maps/Map";
import { createBox } from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import { useEffect, useMemo, useState } from "react";

import { Layer as MapLayer } from "./Layer";
import { QueryLayer } from "./QueryLayer";
import { SelectionLayer } from "./SelectionLayer";
import { useLayerStore } from "./stores/layers";
import { useMapStore } from "./stores/map";
import { useQueryStore } from "./stores/query";

const MAP_CONTROLS = [];

// compute the view based on parameters from the user,
// this handles bounds gracefully.
const handleViewChange = (olView, initialView, callback) => {
  if (initialView.bounds) {
    olView.fit(initialView.bounds, {
      padding: [50, 50, 50, 50],
      callback,
    });
  } else {
    olView.animate(initialView, callback);
  }
};

const controlToType = {
  point: "Point",
  circle: "Circle",
  polygon: "Polygon",
  box: "Circle",
};

const geometryFunctions = {
  box: createBox(),
};

const configureSelectionSource = (setSelectionFeatures) => {
  const source = new VectorSource();

  // the selection source should only include a single feature
  source.on("addfeature", (evt) => {
    source.forEachFeature((feature) => {
      if (feature !== evt.feature) {
        source.removeFeature(feature);
      }
    });
    setSelectionFeatures([evt.feature]);
  });

  return source;
};

export const GeoMooseMap = () => {
  // the view is ready once the "initialView" has been handled,
  //  since most users will want to define their view of interest
  //  as a bounding box, the map needs drawn first and then the view
  //  can be calculated and the layers rendered. Typically this is
  //  a few milliseconds and invisible to the user
  const [currentMap, setCurrentMap] = useState(null);
  const [viewReady, setViewReady] = useState(false);

  const [initialView, mapControl, nextView, clearNextView] = useMapStore(
    (state) => [
      state.initialView,
      state.control,
      state.nextView,
      state.clearNextView,
    ],
  );
  const [backgrounds, layers] = useLayerStore((state) => [
    state.backgrounds,
    state.layers,
  ]);
  // query features are the interim features to be drawn
  const [setSelectionFeatures] = useQueryStore((state) => [
    state.setSelectionFeatures,
  ]);

  useEffect(() => {
    // handle bounds instead of a center/zoom
    if (currentMap && !viewReady) {
      const view = currentMap.getView();
      handleViewChange(view, initialView, () => {
        setViewReady(true);
      });
    }
  }, [currentMap, viewReady, initialView]);

  const selectionSource = useMemo(() => {
    return configureSelectionSource(setSelectionFeatures);
  }, [setSelectionFeatures]);

  useEffect(() => {
    if (currentMap && viewReady && nextView) {
      const view = currentMap.getView();
      // move the map and then clear that from the view settings
      handleViewChange(view, nextView, () => {
        clearNextView();
      });
    }
  }, [currentMap, viewReady, nextView, clearNextView]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <Map
        style={{ width: "100%", height: "100%" }}
        controls={MAP_CONTROLS}
        ref={(olMap) => setCurrentMap(olMap)}
      >
        {["polygon", "box", "circle", "point"].includes(mapControl) && (
          <DrawInteraction
            key={mapControl}
            options={{
              type: controlToType[mapControl],
              geometryFunction: geometryFunctions[mapControl],
              source: selectionSource,
            }}
          />
        )}
        {viewReady && (
          <>
            {backgrounds.map((layer) => (
              <MapLayer key={layer.id} layer={layer} />
            ))}
            {layers.toReversed().map((layer) => (
              <MapLayer key={layer.id} layer={layer} />
            ))}
          </>
        )}
        <QueryLayer key="query-layer" />
        <QueryLayer key="query-preview-layer" isPreview />
        <SelectionLayer />
      </Map>
    </div>
  );
};
