import { useEffect, useState } from 'react'
import { GeoMooseMap } from "./Map";
import { LayersPanel } from "./LayersPanel";
import { SearchPanel } from "./SearchPanel";
import { DataTablePanel } from "./DataTablePanel";
import axios from "axios";

import { useLayerStore } from "./stores/layers";
import { useMapStore } from "./stores/map";

import { LayerProvider } from "./LayerProvider";

import "primereact/resources/themes/mira/theme.css";

import { PrimeReactProvider } from "primereact/api";

function App() {
  const [ready, setReady] = useState(false);
  const parseMapbookLayers = useLayerStore(state => state.parseMapbook);
  const parseMapbookMap = useMapStore(state => state.parseMapbook);

  const [filterSet, setFilterSet] = useState({});

  // this is the core bootstrap of the application.
  useEffect(() => {
    if (!ready) {
      axios.get("./mapbook.json")
        .then(res => {
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
        <SearchPanel
          filterSet={filterSet}
          setFilterSet={setFilterSet}
        />
        <LayersPanel />
        <DataTablePanel />
        <GeoMooseMap
          filterSet={filterSet}
        />
      </PrimeReactProvider>
    </LayerProvider>
  );
  
}

export default App
