import axios from 'axios';
import init, * as parquet from "../node_modules/parquet-wasm/esm/parquet_wasm";
import wasm from "../node_modules/parquet-wasm/esm/parquet_wasm_bg.wasm?url";
import { tableFromIPC } from 'apache-arrow';

const encodeId = (dsId, fId) => {
  return `@${dsId}-${fId}`;
}

self.onmessage = async evt => {


  // init the parquet parser
  await init(wasm);
  console.log("init happened...");
  // get the data
  const response = await axios.get('../ramsey/plan_taxparcel_4326.geoparquet', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-binary',
        'Accept': 'application/octet-stream, application/x-binary, */*',
      },
    });

  console.log('response=', new Uint8Array(response.data));

  const arrowBytes = parquet.readParquet(new Uint8Array(response.data));
  const table = tableFromIPC(arrowBytes.intoIPCStream());

  const geometryColumn = table.getChild("geom");
  const features = [];
  geometryColumn.data.forEach((dataSet, dsIdx) => {
    const offsets = dataSet.valueOffsets;
    for (let i = 1, ii = offsets.length; i < ii; i++) {
      const [start, end] = [offsets[i - 1], offsets[i]]; 
      features.push({
        id: encodeId(dsIdx, i - 1),
        geometry: dataSet.values.slice(start, end),
      });
    }
  });

  console.log('LOADED ALL FEATURES IN THE WEB WORKER', features.length);
  postMessage({
    type: "features-ready",
    features,
  });
}
