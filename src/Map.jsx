import Map from "@planet/maps/Map";
import { useEffect, useState } from "react";

import { Layer as MapLayer } from "./Layer";
import { useLayerStore } from "./stores/layers";
import { useMapStore } from "./stores/map";

const MAP_CONTROLS = [];

// compute the initial view based on parameters from the user,
// this handles bounds gracefully.
const handleInitialView = (olView, initialView, callback) => {
  if (initialView.bounds) {
    olView.fit(initialView.bounds, {
      callback,
    });
  } else {
    olView.animate(initialView, callback);
  }
};

export const GeoMooseMap = () => {
  // the view is ready once the "initialView" has been handled,
  //  since most users will want to define their view of interest
  //  as a bounding box, the map needs drawn first and then the view
  //  can be calculated and the layers rendered. Typically this is
  //  a few milliseconds and invisible to the user
  const [currentMap, setCurrentMap] = useState(null);
  const [viewReady, setViewReady] = useState(false);

  const [initialView] = useMapStore((state) => [state.initialView]);
  const [backgrounds, layers] = useLayerStore((state) => [
    state.backgrounds,
    state.layers,
  ]);

  useEffect(() => {
    // handle bounds instead of a center/zoom
    if (currentMap && !viewReady) {
      const view = currentMap.getView();
      handleInitialView(view, initialView, () => {
        setViewReady(true);
      });
    }
  }, [currentMap, viewReady, initialView]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <Map
        style={{ width: "100%", height: "100%" }}
        controls={MAP_CONTROLS}
        ref={(olMap) => setCurrentMap(olMap)}
      >
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
      </Map>
    </div>
  );
};
