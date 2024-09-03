/* Handle the layer and background layer management.
 *
 */

import { create } from 'zustand';
import { produce } from 'immer';
import { makeStyle } from "../style";

let LAST_ID = 0;
function makeId(prefix = 'id') {
  LAST_ID++;
  return `${prefix}-${LAST_ID}`;
}

let AUTOSTYLE_COUNTER = 0;
// Pallette built from http://medialab.github.io/iwanthue/
const COLORS = [[149,180,134],
[194,178,251],
[174,217,148],
[2,194,208],
[239,182,124],
[237,255,197],
[255,228,206]];


// this is a little messy and semantically odd given the import
// of the `makeStyle` function above but it handles a few more
// oddities of the potential data.
const getStyleName = (layer) => {
  if (typeof(layer.style) === "string" || !!layer.style) {
    // "Auto" styling.
    const styleName = makeStyle(COLORS[AUTOSTYLE_COUNTER], layer.style !== "outlined");
    AUTOSTYLE_COUNTER += 1;
    return styleName;
  }
}

const computeStyle = (layer) => {
  if (layer.type === 'parquet' || layer.type === 'vector') {
    return getStyleName(layer);
  }
  return "";
}

export const useLayerStore = create((set) => ({
  layers: [], 
  backgrounds: [],
  features: {},
  setFeatures: (layerId, features) => {
    set(produce((state) => { state.features[layerId] = features; }));
  },
  parseMapbook: (mapbook) => {
    // ensure that only one background is "turned on",
    let bgSet = false;
    const backgrounds = [...mapbook.backgrounds].map(bgLayer => {
      if (!bgSet && !!bgLayer.on) {
        bgSet = true;
      } else if (bgSet && !!bgLayer.on) {
        // in this case, the background has been "set"
        // and the layer needs turned "off".
        bgLayer.on = false;
      }
      if (!bgLayer.id) {
        bgLayer.id = makeId('background');
      }
      bgLayer.type = bgLayer.type.toLowerCase();
      return {
        ...bgLayer,
        type: bgLayer.type.toLowerCase(),
        style: computeStyle(bgLayer),
      };
    });

    // no background was set, choose the first
    if (!bgSet && backgrounds.length > 0) {
      backgrounds[0].on = true;
    }

    set({
      layers: [...mapbook.layers].map(layer => {
        if (!layer.id) {
          layer.id = makeId('layer');
        }
        return {
          ...layer,
          type: layer.type.toLowerCase(),
          style: computeStyle(layer),
        };
      }),
      backgrounds,
    });
  },
  setLayers: (layers) => {
    set(produce((state) => state.layers = layers));
  },
  setLayerOn: (layerId, isOn) => {
    set(produce((state) => {
      const layerIdx = state.layers.findIndex(layer => layer.id === layerId);
      if (layerIdx < 0) {
        // check to see if it is a background layer...
        const bgIdx = state.backgrounds.findIndex(bg => bg.id === layerId);
        if (bgIdx < 0) {
          console.error(`setLayerOn: Could not find layer with id=${layerId}.`);
        } else {
          // this is likely a little hacky...
          for (let i = 0, ii = state.backgrounds.length; i < ii; i++) {
            state.backgrounds[i].on = (i === bgIdx);
          }
        }
      } else {
        state.layers[layerIdx].on = isOn; 
      }
    }));
  },
}));
