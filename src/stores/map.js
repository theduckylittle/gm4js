import { produce } from "immer";
import { create } from "zustand";

export const useMapStore = create((set) => ({
  initialView: {},
  parseMapbook: (mapbook) => {
    const updates = {};
    if (mapbook.map?.initialView) {
      updates.initialView = mapbook.map.initialView;
    } else {
      // default the initial view to null island if not provided.
      updates.initialView = [0, 0, 2];
    }
    set(updates);
  },

  // handle which control is enabled on the map.
  control: "",
  setControl: (control) => {
    set(
      produce((state) => {
        state.control = control;
      }),
    );
  },

  // buffer settings for select operations
  bufferSettings: {
    on: false,
    distance: 0,
    units: "ft",
  },
  setBufferSettings: (options) => {
    set(
      produce((state) => {
        Object.keys(options).forEach((opt) => {
          state.bufferSettings[opt] = options[opt];
        });
      }),
    );
  },
}));
