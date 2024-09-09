/* Handle the layer and background layer management.
 *
 */

import { create } from "zustand";

export const useSiteSettingsStore = create((set) => ({
  logoHtml: "Your site name and logo can go here.",
  parseMapbook: (mapbook) => {
    const elements = ["logoHtml"];
    const nextState = {};
    elements.forEach((key) => {
      if (mapbook.siteSettings[key] !== undefined) {
        nextState[key] = mapbook.siteSettings[key];
      }
    });

    set(nextState);
  },
}));
