import { create } from 'zustand';
// import { produce } from 'immer';

export const useMapStore = create((set) => ({
  initialView: {},
  parseMapbook: mapbook => {
    const updates = {};
    if (mapbook.map?.initialView) {
      updates.initialView = mapbook.map.initialView;
    } else {
      // default the initial view to null island if not provided.
      updates.initialView = [0, 0, 2];
    }
    set(updates);
  },
}));
