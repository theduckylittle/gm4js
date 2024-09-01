import { useState } from "react";
import { useQueryStore } from "./stores/query";

export const Search = () => {
  const [filterSet, setFilterSet] = useQueryStore(state => [state.filterSet, state.setFilterSet]);
  const [searchString, setSearchString] = useState("");
  const doSearch = () => {
    const nextFilters = {
      ...filterSet,
    };
    if (searchString.length < 3) {
      delete nextFilters.filterString;
    } else {
      nextFilters.filterString = searchString.toLowerCase();
    }

    setFilterSet(nextFilters);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
      }}
    >
        <input 
          style={{padding: 8, flex: 1}}
          onChange={evt => setSearchString(evt.target.value)} value={searchString}
          onKeyPress={evt => {
            if (evt.key === "Enter") {
              doSearch();
            }
          }}
        />
        <button
          onClick={doSearch}
        >
          Search
        </button>
      </div>
  );
}
