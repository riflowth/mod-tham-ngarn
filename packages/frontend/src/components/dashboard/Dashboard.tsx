import { Navbar } from '@components/dashboard/navbar/Navbar';
import { Sidebar } from '@components/dashboard/sidebar/Sidebar';

type DashboardProp = {
  children?: React.ReactChild,
};

export const Dashboard = ({
  children,
}: DashboardProp) => {
  return (
    <div className="w-full h-screen bg-zinc-800">
      <div className="flex h-full">
        <div className="flex flex-shrink-0 flex-col">
          <Sidebar />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex flex-row">
            <Navbar />
          </div>
          <div className="flex overflow-y-auto h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
