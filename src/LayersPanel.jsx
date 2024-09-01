import PropTypes from "prop-types";
import { useState } from "react";
import { gmMapPanel, gmMapPanelCollapsed, gmMapPanelTitleBar, gmMapPanelTitleBarCollapsed, gmMapPanelContent } from "./common.module.css";
import {
  gmLayer,
} from "./layers.module.css";

import { Checkbox } from "./Checkbox";

import { IconButton } from "./IconButton";

import { IconStack2 as LayersIcon } from "@tabler/icons-react";
import { IconStack2Filled as FilledLayersIcon } from "@tabler/icons-react";

import { useLayerStore } from "./stores/layers";

export const Layer = ({layer, setLayerOn, exclusive}) => {
  // ensure this a boolean
  const isOn = !!layer.on;
  return (
    <div className={gmLayer}>
      <Checkbox checked={isOn} exclusive={exclusive}
        onClick={() => {
          // ensure that the toggle is a boolean
          setLayerOn(layer.id, !isOn);
        }}
      >
        {layer.title}
      </Checkbox>
    </div>
  );
}

Layer.propTypes = {
  layer: PropTypes.object,
  setLayerOn: PropTypes.func,
  exclusive: PropTypes.bool,
};

export const LayersPanel = () => {
  const [open, setOpen] = useState(true);
  //  const bears = useBearStore((state) => state.bears)
  const [layers, setLayerOn, backgrounds] = useLayerStore(state => [state.layers, state.setLayerOn, state.backgrounds]);
  return (
    <div
      className={open ? gmMapPanel : gmMapPanelCollapsed }
      style={{
        right: "20px",
        top: "20px",
        width: "360px",
        maxWidth: open ? "360px" : "30px",
        overflow: "hidden",
      }}
    >
      <div className={open ? gmMapPanelTitleBar : gmMapPanelTitleBarCollapsed }>
        <div style={{flex: 1}}>
          Layers
        </div>
        <IconButton
          onClick={() => {
            setOpen(v => !v);
          }}
          title="Show or hide the layers panel"
        >
          {open && <LayersIcon color="black" size={32} />}
          {!open && <FilledLayersIcon color="black" size={32} />}
        </IconButton>
      </div>
      <div className={gmMapPanelContent}>
        <h3>Overlays</h3>
        {layers.length === 0 && (
          <div>
            <b>No layers are configured.</b>
          </div>
        )}
        {layers.map(layer => (
          <Layer
            layer={layer}
            setLayerOn={setLayerOn}
            key={layer.id}
          />
        ))}
        <h3>Backgrounds</h3>
        {backgrounds.map(bgLayer => (
          <Layer
            layer={bgLayer}
            setLayerOn={setLayerOn}
            key={bgLayer.id}
            exclusive
          />
        ))}
      </div>
    </div>
  );

} 
