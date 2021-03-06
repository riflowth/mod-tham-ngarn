import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { MaintenanceLogItems } from "@components/maintenancelog/MaintenanceLogItems";
import { MaintenanceLogModal } from "@components/maintenancelog/MaintenanceLogModal";
import { MaintenanceLog } from "@models/MaintenanceLog";
import { withUser } from "@components/hoc/withUser";

const MaintenancesPage: NextPage = () => {
  return (
    <Dashboard current="Ticket">
      <div className="w-full p-8 overflow-y-auto">
        <TableComponent<MaintenanceLog>
          path={"maintenance"}
          title={"Maintenance Logs"}
          columns={[
            "Id",
            "Machine",
            "Status",
            "Reporter",
            "Report Date",
            "Maintenance Date",
            "",
          ]}
        >
          <MaintenanceLogItems rows={[]} />
          <MaintenanceLogModal />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(MaintenancesPage);
