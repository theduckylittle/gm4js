import "primereact/resources/themes/mira/theme.css";

import axios from "axios";
import { PrimeReactProvider } from "primereact/api";
import { useEffect, useState } from "react";

import { DataTablePanel } from "./DataTablePanel";
import { LayerProvider } from "./LayerProvider";
import { LayersPanel } from "./LayersPanel";
import { GeoMooseMap } from "./Map";
import { SearchPanel } from "./SearchPanel";
import { useLayerStore } from "./stores/layers";
import { useMapStore } from "./stores/map";
import { useSiteSettingsStore } from "./stores/site-settings";

function App() {
  const [ready, setReady] = useState(false);
  const parseMapbookLayers = useLayerStore((state) => state.parseMapbook);
  const parseMapbookMap = useMapStore((state) => state.parseMapbook);
  const parseMapbookSiteSettings = useSiteSettingsStore(
    (state) => state.parseMapbook,
  );

  const [filterSet, setFilterSet] = useState({});

  // this is the core bootstrap of the application.
  useEffect(() => {
    if (!ready) {
      // get the links and find the mapbook one
      const links = document.getElementsByTagName("link");
      let mapbookSrc = "";
      for (let i = 0, ii = links.length; i < ii; i++) {
        const link = links[i];
        if (link.getAttribute("rel") === "mapbook") {
          mapbookSrc = link.getAttribute("href");
        }
      }

      if (!mapbookSrc) {
        console.warn(
          "Using default mapbook url as a <link rel='mapbook'> was not found.",
        );
        mapbookSrc = "/mapbook.json";
      }

      axios.get(mapbookSrc).then((res) => {
        parseMapbookLayers(res.data);
        parseMapbookMap(res.data);
        parseMapbookSiteSettings(res.data);
        setReady(true);
      });
    }
  }, [ready, parseMapbookLayers, parseMapbookMap, parseMapbookSiteSettings]);

  if (!ready) {
    return false;
  }

  return (
    <LayerProvider>
      <PrimeReactProvider>
        <SearchPanel filterSet={filterSet} setFilterSet={setFilterSet} />
        <LayersPanel />
        <DataTablePanel />
        <GeoMooseMap filterSet={filterSet} />
      </PrimeReactProvider>
    </LayerProvider>
  );
}

export default App;
