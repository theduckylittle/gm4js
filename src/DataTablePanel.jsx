import { IconFileTypeCsv, IconTable, IconZoomScan } from "@tabler/icons-react";
import { extend as extendExtent } from "ol/extent";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import { TabPanel, TabView } from "primereact/tabview";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

import { gmDataTablePanel } from "./DataTable.module.css";
import { useLayerStore } from "./stores/layers";
import { useMapStore } from "./stores/map";
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
    return (
      Object.keys(featureData[0].properties)
        // ignore any properties that start with the internal prefix
        .filter((prop) => !prop.startsWith("gm:"))
        .map((prop) => ({
          title: prop,
          field: prop,
        }))
    );
  }
}

const ZoomButton = ({ bounds }) => {
  const [setNextView] = useMapStore((state) => [state.setNextView]);
  return (
    <Button
      rounded
      icon={<IconZoomScan />}
      text
      onClick={() => {
        setNextView({
          bounds,
        });
      }}
    ></Button>
  );
};

ZoomButton.propTypes = {
  bounds: PropTypes.array,
};

const zoomToTemplate = (properties) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ZoomButton bounds={properties["gm:bounds"]} />
    </div>
  );
};

const GeoMooseDataTable = ({ layer, features }) => {
  const [setNextView] = useMapStore((state) => [state.setNextView]);
  const columnDefs = getColumnDefs(layer, features);
  const values = features.map((feature) => feature.properties);
  const dataTableRef = useRef(null);

  const exportCSV = (selectionOnly) => {
    dataTableRef.current.exportCSV({
      selectionOnly,
    });
  };

  const zoomToAll = () => {
    // this state is frozen with immer, it needs released
    //  to work with extendExtent.
    let bounds = values[0]["gm:bounds"].map((v) => v);
    for (let i = 1, ii = values.length; i < ii; i++) {
      extendExtent(bounds, values[i]["gm:bounds"]);
    }
    setNextView({ bounds });
  };

  return (
    <>
      <DataTable
        ref={dataTableRef}
        value={values}
        showGridlines
        paginator
        rows={10}
        size="small"
        rowsPerPageOptions={[5, 10, 25, 50]}
        scrollable
        scrollHeight={240}
        resizableColumns
        removableSort
        exportFilename={`${layer.id}`}
        paginatorLeft={
          <>
            <Button
              icon={<IconZoomScan />}
              onClick={() => {
                zoomToAll();
              }}
              text
            />
            <Button
              icon={<IconFileTypeCsv />}
              onClick={() => {
                exportCSV(false);
              }}
              text
              type="button"
            />
          </>
        }
        // this is a bit of a "dead pedal" to make the flex layout more balanced
        paginatorRight={<div />}
      >
        <Column
          key="zoomto"
          header=""
          field={"gm:bounds"}
          body={zoomToTemplate}
          style={{ padding: 0 }}
        />
        {columnDefs.map((columnDef) => (
          <Column
            sortable
            key={columnDef.title}
            field={columnDef.field}
            header={columnDef.title}
          />
        ))}
      </DataTable>
    </>
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
