import axios from 'axios';
import init, * as parquet from "../node_modules/parquet-wasm/esm/parquet_wasm";
import wasm from "../node_modules/parquet-wasm/esm/parquet_wasm_bg.wasm?url";
import { Type, tableFromIPC } from 'apache-arrow';

const encodeId = (dsId, fId) => {
  return `@${dsId}-${fId}`;
}

let TABLE = null;

async function loadTable(url) {
  const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-binary',
        'Accept': 'application/octet-stream, application/x-binary, */*',
      },
    });


  const arrowBytes = parquet.readParquet(new Uint8Array(response.data));
  const table = await tableFromIPC(arrowBytes.intoIPCStream());
  return table;
}

function runQuery(query) {
  const queryString = query.filterString;

  const fieldDefs = TABLE.schema.fields.filter(field => field.type.typeId === Type.Utf8 || field.type.typeId === Type.LargeUtf8);
  const decoder = new TextDecoder();
  const matchingIndexes = {};
  fieldDefs.forEach(fieldDef => {
    const field = TABLE.getChild(fieldDef.name);
    field.data.forEach((dataSet, dsIdx) => {
      if (!matchingIndexes[dsIdx]) {
        matchingIndexes[dsIdx] = {};
      }

      const offsets = dataSet.valueOffsets;
      for (let i = 1, ii = offsets.length; i < ii; i++) {
        const [start, end] = [offsets[i - 1], offsets[i]]; 
        const asUtf = decoder.decode(dataSet.values.slice(start, end));
        // do the string comparison
        if (asUtf.toLowerCase().includes(queryString)) {
          matchingIndexes[dsIdx][i - 1] = true;
        }
      }
    });
  });

  // flatten this for faster indexing.
  const matches = [];
  Object.keys(matchingIndexes).forEach(dsId => {
    Object.keys(matchingIndexes[dsId]).forEach(idx => {
      matches.push(encodeId(dsId, idx));
    });
  });

  return matches;
}


self.onmessage = async evt => {
  if (evt.data.type === 'load-table' && !TABLE) {
    await init(wasm);
    TABLE = await loadTable(evt.data.url);
    postMessage({
      type: "table-ready",
    });
  } else if (evt.data.type === 'load-features' && TABLE) {
    // TODO: If the column name is not given, then look for the final bytes array column.
    const geometryColumn = TABLE.getChild(evt.data.column);
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
    postMessage({
      type: "features-ready",
      features,
    });
  } else if (evt.data.type === 'execute-query' && TABLE) {
    postMessage({
      type: "query-ready",
      results: runQuery(evt.data.query),
    });
  }
}
