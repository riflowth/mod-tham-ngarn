import { Dashboard } from '@components/dashboard/Dashboard';
import { MaintenanceLogItems } from '@components/maintenanceLog/MaintenanceLogItems';
import { MaintenanceBoard } from '@components/maintenanceLog/MaintenanceBoard';
import { MaintenancePartItems } from '@components/maintenanceLog/MaintenancePartItems';
import { TableComponent } from '@components/table/TableComponent';
import { MaintenanceLog } from '@models/MaintenanceLog';
import { MaintenancePart } from '@models/MaintenancePart';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const MaintenancePage: NextPage = () => {
  const router = useRouter();
  const maintenanceId = Number(router.query.maintenanceId);

  return (
    <Dashboard>
      <>
        <MaintenanceBoard
          maintenanceId={maintenanceId}
        />
        <TableComponent<MaintenancePart>
          path={`maintenance/${maintenanceId}/part`}
          title={'Maintenance Parts'}
          columns={['maintenanceId', 'partId', 'type', 'status', 'orderId']}
        >
          <MaintenancePartItems rows={[]} />
        </TableComponent>
      </>

    </Dashboard>
  );
};

export default MaintenancePage;
