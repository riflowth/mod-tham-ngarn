import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';
import { Disclosure } from '@headlessui/react';
import { TableComponent } from '@components/table/TableComponent';
import { MaintenanceLogItems } from "@components/maintenancelog/MaintenanceLogItems";
import { MaintenanceLog } from "@models/MaintenanceLog";

const MaintenancesPage: NextPage = () => {
  return (
      <Dashboard>
        <TableComponent<MaintenanceLog>
          path={'maintenance'}
          title={'Maintenance Logs'} 
          columns={['Id', 'Machine', 'Status', 'Reporter', 'Report Date', 'Maintenance Date']} 
        >
          <MaintenanceLogItems rows={[]} />
        </TableComponent> 
      </Dashboard>
  );
}

export default MaintenancesPage;
