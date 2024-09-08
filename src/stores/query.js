/* Handle the layer and background layer management.
 *
 */
import { produce } from "immer";
import { create } from "zustand";

export const useQueryStore = create((set) => ({
  featureDataRequests: {},
  requestFeatureData: (layerId, columns) => {
    // TODO: It would be good to make this de-dupe and handle
    //       overlaps
    set(
      produce((state) => {
        const columnKey = columns.join(",");
        state.featureDataRequests[layerId] = {
          ...state.featureDataRequests[layerId],
          [columnKey]: "pending",
        };
      }),
    );
  },
  updateFeatureDataRequest: (layerId, columns, nextState = "finished") => {
    // mark the data request as fulfilled
    set(
      produce((state) => {
        state.featureDataRequests[layerId] = {
          ...state.featureDataRequests[layerId],
          [columns.join(",")]: nextState,
        };
      }),
    );
  },
  featureData: {},
  setFeatureData: (layerId, featureData) => {
    set(
      produce((state) => {
        state.featureData[layerId] = featureData;
      }),
    );
  },
  clearFeatureData: (layerId) => {
    set(produce((state) => (state.featureData[layerId] = [])));
  },
  filterSet: {},
  setFilterSet: (filterSet) => {
    set({
      filterSet,
    });
  },
  clearFilters: () => {
    set({
      filterSet: {},
    });
  },
  selectedFeatures: {},
  setSelectedFeatures: (layerId, features) => {
    set(
      produce((state) => {
        state.selectedFeatures[layerId] = features;
      }),
    );
  },
  clearSelectedFeatures: (layerId) => {
    if (layerId) {
      set(produce((state) => (state.selectedFeatures[layerId] = [])));
    } else {
      set({
        selectedFeatures: {},
      });
    }
  },

  // query features are those used for select and identify
  queryFeatures: [],
  setQueryFeatures: (queryFeatures) => {
    set(
      produce((state) => {
        state.queryFeatures = queryFeatures;
      }),
    );
  },
  clearQueryFeatures: () => {
    set(
      produce((state) => {
        state.queryFeatures = [];
      }),
    );
  },

  // selection features are those used for select and identify
  selectionFeatures: [],
  setSelectionFeatures: (selectionFeatures) => {
    set(
      produce((state) => {
        state.selectionFeatures = selectionFeatures;
      }),
    );
  },
  clearSelectionFeatures: () => {
    set(
      produce((state) => {
        state.selectionFeatures = [];
      }),
    );
  },
}));
