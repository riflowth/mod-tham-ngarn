import { Dashboard } from '@components/dashboard/Dashboard';
import { MaintenanceBoard } from '@components/Maintenance/MaintenanceBoard';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const MaintenancePage: NextPage = () => {
  const router = useRouter();
  const maintenanceId = Number(router.query.maintenanceId);

  return (
    <Dashboard>
      <MaintenanceBoard
        maintenanceId={maintenanceId}
      />
    </Dashboard>
  );
};

export default MaintenancePage;
