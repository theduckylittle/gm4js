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

function App() {
  const [ready, setReady] = useState(false);
  const parseMapbookLayers = useLayerStore((state) => state.parseMapbook);
  const parseMapbookMap = useMapStore((state) => state.parseMapbook);

  const [filterSet, setFilterSet] = useState({});

  // this is the core bootstrap of the application.
  useEffect(() => {
    if (!ready) {
      axios.get("/mapbook.json").then((res) => {
        parseMapbookLayers(res.data);
        parseMapbookMap(res.data);
        setReady(true);
      });
    }
  }, [ready, parseMapbookLayers, parseMapbookMap]);

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
