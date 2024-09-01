/* Handle the layer and background layer management.
 *
 */
import { create } from 'zustand';
import { produce } from 'immer';

export const useQueryStore = create((set) => ({
  filterSet: {},
  setFilterSet: (filterSet) => {
    set({
      filterSet,
    });
  },
  selectedFeatures: {},
  setSelectedFeatures: (layerId, features) => {
    set(produce((state) => { state.selectedFeatures[layerId] = features; }));
  },
  clearSelectedFeatures: (layerId) => {
    if (layerId) {
      set(produce((state) => state.selectedFeatures[layerId] = []));
    } else {
      set({
        selectedFeatures: {},
      });
    }
  },
}));
