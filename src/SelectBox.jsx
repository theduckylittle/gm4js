/**
 * Controls from add/removing a select interaction
 * from the map.
 */

import {
  IconCircle,
  IconCircleOff,
  IconMapPin,
  IconPolygon,
  IconSquare,
} from "@tabler/icons-react";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

import { transformSelectionFeatures } from "./selection";
import { useMapStore } from "./stores/map";
import { useQueryStore } from "./stores/query";

const SELECT_CONTROLS = [
  {
    name: "off",
    control: "",
    icon: <IconCircleOff />,
  },
  {
    name: "polygon",
    control: "polygon",
    icon: <IconPolygon />,
  },
  {
    name: "point",
    control: "point",
    icon: <IconMapPin />,
  },
  {
    name: "box",
    control: "box",
    icon: <IconSquare />,
  },
  {
    name: "circle",
    control: "circle",
    icon: <IconCircle />,
  },
];

const LENGTH_UNITS = ["ft", "yd", "mi", "in", "m", "km", "ch"];

export const SelectBox = () => {
  const [mapControl, setMapControl, bufferSettings, setBufferSettings] =
    useMapStore((state) => [
      state.control,
      state.setControl,
      state.bufferSettings,
      state.setBufferSettings,
    ]);

  const [
    selectionFeatures,
    clearSelectionFeatures,
    setQueryFeatures,
    clearQueryFeatures,
  ] = useQueryStore((state) => [
    state.selectionFeatures,
    state.clearSelectionFeatures,
    state.setQueryFeatures,
    state.clearQueryFeatures,
  ]);

  return (
    <>
      <h3>Select features on the map</h3>
      <h4>Selection tool</h4>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ButtonGroup style={{ display: "flex", flex: 1 }}>
          {SELECT_CONTROLS.map((controlDef) => (
            <Button
              style={{ flex: 1 }}
              key={controlDef.name}
              icon={controlDef.icon}
              aria-label={`Select elements on the map using the ${controlDef.control} tool`}
              text={controlDef.control !== mapControl}
              onClick={() => setMapControl(controlDef.control)}
            />
          ))}
        </ButtonGroup>
      </div>

      <div className="p-fluid">
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <label htmlFor="input-select-distance" style={{ fontWeight: "bold" }}>
            Buffer distance
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <InputNumber
              style={{ flex: 1 }}
              inputId="input-select-distance"
              value={bufferSettings.distance}
              onChange={(evt) => {
                setBufferSettings({ distance: evt.value });
              }}
            />
            <Dropdown
              style={{ width: "8em" }}
              options={LENGTH_UNITS.map((unit) => ({ code: unit }))}
              optionLabel={(unit) => unit.code.toUpperCase()}
              value={{ code: bufferSettings.units }}
              onChange={(evt) => {
                setBufferSettings({ units: evt.value.code });
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => {
              clearSelectionFeatures();
              clearQueryFeatures();
            }}
            text
          >
            Clear selection
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setQueryFeatures(
                transformSelectionFeatures(selectionFeatures, bufferSettings),
              );
            }}
          >
            Select features
          </Button>
        </div>
      </div>
    </>
  );
};
