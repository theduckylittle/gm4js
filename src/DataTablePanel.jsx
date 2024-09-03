import { IconTable } from "@tabler/icons-react";
import { useEffect } from "react";

import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';

import { gmDataTablePanel } from './DataTable.module.css';

import { useLayerStore } from "./stores/layers";
import { useQueryStore } from "./stores/query";

const GeoMooseDataTable = () => {
};


export const DataTablePanel = () => {
  // the layers to be rendered in the table must meet the following requirements:
  // * a query must have been executed
  // * the layer must be on
  // * the layer must have results from the current query.
  //
  const [layers] = useLayerStore(state => [state.layers]);
  const [selectedFeatures, requestFeatureData, featureDataRequests] = useQueryStore(state => [state.selectedFeatures, state.requestFeatureData, state.featureDataRequests]);

  const layersWithSelectedFeatures = layers.filter(layer => {
    return layer.on && !!selectedFeatures[layer.id] && selectedFeatures[layer.id].length > 0;
  });

  useEffect(() => {
    layersWithSelectedFeatures.forEach(layer => {
      if (!featureDataRequests[layer.id]) {
        // recall all columns
        requestFeatureData(layer.id, ['*',]);
      }
    });
  }, [requestFeatureData, layersWithSelectedFeatures]);

  console.log("layers with selected features=", layersWithSelectedFeatures, featureDataRequests);

  return (
    <Panel
      className={gmDataTablePanel}
      toggleable
      header={
        <div style={{display: "flex", alignItems: "center", gap: 2}}>
          <div>
            <IconTable />
          </div>
          <div>
            Table view
          </div>
        </div>
      }
    >
      <TabView>
        {layersWithSelectedFeatures.map(layer => (
          <TabPanel
            header={`${layer.title}: ${selectedFeatures[layer.id].length}`}
            key={layer.id}
          >
            <ul>
              <li key={layer.id}>
                {layer.title}: {selectedFeatures[layer.id].length}
              </li>
            </ul>
         </TabPanel>
        ))}
      </TabView>
    </Panel>
  );
}
