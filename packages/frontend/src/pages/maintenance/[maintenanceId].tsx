import { Dashboard } from '@components/dashboard/Dashboard';
import Maintenance from '@components/Maintenance/Maintenance';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

const MaintenancePage: NextPage = () => {
  const router = useRouter();

  const maintenanceId = Number(router.query.maintenanceId);

  if (isNaN(maintenanceId)) {
    return <div>heheh</div>
  } else {
    return (
      <div className="w-full h-full p-4 bg-zinc-800">
        {/* <Dashboard> */}
          <Maintenance maintenanceId={maintenanceId} />
        {/* </Dashboard> */}
      </div>
    )
  }

};

export default MaintenancePage;
