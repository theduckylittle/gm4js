import { IconStack2 as LayersIcon } from "@tabler/icons-react";
import { Checkbox } from "primereact/checkbox";
import { Panel } from "primereact/panel";
import { RadioButton } from "primereact/radiobutton";
import PropTypes from "prop-types";

import { gmLayer, gmLayersPanel } from "./layers.module.css";
import { useLayerStore } from "./stores/layers";

export const Layer = ({ layer, setLayerOn, exclusive }) => {
  // ensure this a boolean
  const isOn = !!layer.on;
  const Element = exclusive ? RadioButton : Checkbox;
  return (
    <div className={gmLayer}>
      <Element
        inputId={`input-${layer.id}`}
        onChange={() => {
          // ensure that the toggle is a boolean
          setLayerOn(layer.id, !isOn);
        }}
        checked={isOn}
      />
      <label htmlFor={`input-${layer.id}`}>{layer.title}</label>
    </div>
  );
};

Layer.propTypes = {
  layer: PropTypes.object,
  setLayerOn: PropTypes.func,
  exclusive: PropTypes.bool,
};

export const LayersPanel = () => {
  const [layers, setLayerOn, backgrounds] = useLayerStore((state) => [
    state.layers,
    state.setLayerOn,
    state.backgrounds,
  ]);
  return (
    <Panel
      header={
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LayersIcon />
          <div style={{ flex: 1 }}>Layers</div>
        </div>
      }
      toggleable
      className={gmLayersPanel}
    >
      <div>
        <h3>Overlays</h3>
        {layers.length === 0 && (
          <div>
            <b>No layers are configured.</b>
          </div>
        )}
        {layers.map((layer) => (
          <Layer layer={layer} setLayerOn={setLayerOn} key={layer.id} />
        ))}
        <h3>Backgrounds</h3>
        {backgrounds.map((bgLayer) => (
          <Layer
            layer={bgLayer}
            setLayerOn={setLayerOn}
            key={bgLayer.id}
            exclusive
          />
        ))}
      </div>
    </Panel>
  );
};
