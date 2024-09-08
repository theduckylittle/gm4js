import { IconTable } from "@tabler/icons-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import { TabPanel, TabView } from "primereact/tabview";
import PropTypes from "prop-types";
import { useEffect } from "react";

import { gmDataTablePanel } from "./DataTable.module.css";
import { useLayerStore } from "./stores/layers";
import { useQueryStore } from "./stores/query";

function getColumnDefs(layerDef, featureData) {
  if (layerDef.table?.columns) {
    // TODO: Implement a hand crafted set of values.
  } else {
    // if no matching features, return no columns
    if (!featureData || featureData.length === 0) {
      return [];
    }
    // sniff the first feature
    return Object.keys(featureData[0].properties).map((prop) => ({
      title: prop,
      field: prop,
    }));
  }
}

const GeoMooseDataTable = ({ layer, features }) => {
  const columnDefs = getColumnDefs(layer, features);
  const values = features.map((feature) => feature.properties);

  return (
    <DataTable
      value={values}
      showGridlines
      size="small"
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      scrollable
      scrollHeight={240}
      resizableColumns
      removableSort
    >
      {columnDefs.map((columnDef) => (
        <Column
          sortable
          key={columnDef.title}
          field={columnDef.field}
          header={columnDef.title}
        />
      ))}
    </DataTable>
  );
};

GeoMooseDataTable.propTypes = {
  layer: PropTypes.object,
  features: PropTypes.array,
};

export const DataTablePanel = () => {
  // the layers to be rendered in the table must meet the following requirements:
  // * a query must have been executed
  // * the layer must be on
  // * the layer must have results from the current query.
  //
  const [layers] = useLayerStore((state) => [state.layers]);
  const [
    selectedFeatures,
    requestFeatureData,
    featureDataRequests,
    featureData,
  ] = useQueryStore((state) => [
    state.selectedFeatures,
    state.requestFeatureData,
    state.featureDataRequests,
    state.featureData,
  ]);

  const layersWithSelectedFeatures = layers.filter((layer) => {
    return (
      layer.on &&
      !!selectedFeatures[layer.id] &&
      selectedFeatures[layer.id].length > 0
    );
  });

  useEffect(() => {
    layersWithSelectedFeatures.forEach((layer) => {
      if (!featureDataRequests[layer.id]) {
        // recall all columns
        requestFeatureData(layer.id, ["*"]);
      }
    });
  }, [requestFeatureData, layersWithSelectedFeatures, featureDataRequests]);

  return (
    <Panel
      className={gmDataTablePanel}
      toggleable
      header={
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div>
            <IconTable />
          </div>
          <div>Table view</div>
        </div>
      }
    >
      <TabView>
        {layersWithSelectedFeatures.map((layer) => (
          <TabPanel
            header={`${layer.title}: ${selectedFeatures[layer.id].length}`}
            key={layer.id}
          >
            {featureData[layer.id] && (
              <GeoMooseDataTable
                layer={layer}
                features={featureData[layer.id]}
              />
            )}
          </TabPanel>
        ))}
      </TabView>
    </Panel>
  );
};
