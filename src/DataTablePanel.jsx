import { IconTable } from "@tabler/icons-react";

import { Panel } from 'primereact/panel';

import { gmDataTablePanel } from './DataTable.module.css';

const GeoMooseDataTable = () => {
};


export const DataTablePanel = () => {
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
    </Panel>
  );
}
