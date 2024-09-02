import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'

import 'ol/ol.css';

import { useGeographic as setGeographic } from "ol/proj";

setGeographic();

ReactDOM.createRoot(document.getElementById('gm-root')).render(
  <React.Fragment>
    <App />
  </React.Fragment>,
)
