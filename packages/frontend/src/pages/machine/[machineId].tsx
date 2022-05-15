import { Dashboard } from "@components/dashboard/Dashboard";
import { withUser } from "@components/hoc/withUser";
import { TableComponent } from "@components/table/TableComponent";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { MachinePart } from "@models/MachinePart";
import { MachinePartItems } from "@components/machinepart/MachinePartItem";
import { MachinePartsModal } from "@components/machinepart/MachinePartModal";

const MaintenancePage: NextPage = () => {
  const router = useRouter();
  const machineId = Number(router.query.machineId);

  return (
    <Dashboard current="Bill">
      <div className="w-full h-full p-8">
        <TableComponent<MachinePart>
          path={`machine/${machineId}/part`}
          title={"MachinePart"}
          columns={["partId", "machineId", "partName", "status", "", ""]}
        >
          <MachinePartItems rows={[]} />
          <MachinePartsModal machineId={machineId} />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(MaintenancePage);
