import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { MaintenanceBoard } from '@components/maintenancelog/MaintenanceBoard';
import { MaintenancePartItems } from '@components/maintenancelog/MaintenancePartItems';
import { TableComponent } from '@components/table/TableComponent';
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
          <div>deleteme</div>
        </TableComponent>
      </>

    </Dashboard>
  );
};

export default withUser(MaintenancePage);
