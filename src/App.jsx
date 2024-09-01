import { useEffect, useState } from 'react'
import { GeoMooseMap } from "./Map";
import { LayersPanel } from "./LayersPanel";
import { SearchPanel } from "./SearchPanel";
import axios from "axios";

import { useLayerStore } from "./stores/layers";

function App() {
  const [ready, setReady] = useState(false);
  const parseMapbook = useLayerStore(state => state.parseMapbook);

  const [filterSet, setFilterSet] = useState({});

  // this is the core bootstrap of the application.
  useEffect(() => {
    if (!ready && parseMapbook) {
      axios.get("./mapbook.json")
        .then(res => {
          parseMapbook(res.data);
          setReady(true);
        });
    }
  }, [ready, parseMapbook]);

  if (!ready) {
    return false;
  }

  return (
      <>
        <SearchPanel
          filterSet={filterSet}
          setFilterSet={setFilterSet}
        />
        <LayersPanel
        />
        <GeoMooseMap
          filterSet={filterSet}
        />
      </>
    );
  
}

export default App
