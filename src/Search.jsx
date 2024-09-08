import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

import { useQueryStore } from "./stores/query";

export const Search = () => {
  const [filterSet, setFilterSet, clearFilters] = useQueryStore((state) => [
    state.filterSet,
    state.setFilterSet,
    state.clearFilters,
  ]);
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
        flexDirection: "column",
      }}
    >
      <label htmlFor="input-search" style={{ fontWeight: "bold" }}>
        Search text
      </label>
      <InputText
        id="input-search"
        style={{ padding: 8, flex: 1 }}
        onChange={(evt) => setSearchString(evt.target.value)}
        value={searchString}
        onKeyPress={(evt) => {
          if (evt.key === "Enter") {
            doSearch();
          }
        }}
      />
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => {
              clearFilters();
            }}
            text
          >
            Clear search
          </Button>
        </div>
        <div>
          <Button onClick={doSearch}>Search</Button>
        </div>
      </div>
    </div>
  );
};
