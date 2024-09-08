import "ol/ol.css";

import { useGeographic as setGeographic } from "ol/proj";
import { addCoordinateTransforms, addProjection, Projection } from "ol/proj";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import { easeGridToLonLat, lonLatToEaseGrid } from "./projections.js";

setGeographic();

// Configure the EASE grid projection
addProjection(
  new Projection({
    code: "EPSG:6933",
    units: "meters",
  }),
);
addCoordinateTransforms(
  "EPSG:4326",
  "EPSG:6933",
  lonLatToEaseGrid,
  easeGridToLonLat,
);

ReactDOM.createRoot(document.getElementById("gm-root")).render(
  <React.Fragment>
    <App />
  </React.Fragment>,
);
