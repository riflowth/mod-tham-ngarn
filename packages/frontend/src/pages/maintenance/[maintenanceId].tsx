import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { MaintenanceBoard } from '@components/maintenancelog/MaintenanceLogBoard';
import { MaintenancePartItems } from '@components/maintenancePart/MaintenancePartItems';
import { MaintenancePartModal } from '@components/maintenancePart/MaintenancePartModal';
import { TableComponent } from '@components/table/TableComponent';
import { MaintenancePart } from '@models/MaintenancePart';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const MaintenancePage: NextPage = () => {
  const router = useRouter();
  const maintenanceId = Number(router.query.maintenanceId);

  return (
    <Dashboard current="Ticket">
      <div className="h-full w-full overflow-y-auto p-8">
        <MaintenanceBoard
          maintenanceId={maintenanceId}
        />
        <TableComponent<MaintenancePart>
          path={`maintenance/${maintenanceId}/part`}
          title={'Maintenance Parts'}
          columns={['maintenanceId', 'partId', 'type', 'status', 'orderId', "", ""]}
        >
          <MaintenancePartItems rows={[]} />
          <MaintenancePartModal maintenanceId={maintenanceId} />
        </TableComponent>
      </div>

    </Dashboard>
  );
};

export default withUser(MaintenancePage);
