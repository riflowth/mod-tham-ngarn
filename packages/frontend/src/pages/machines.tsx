import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { MachineItems } from "@components/machine/MachineItems";
import { Machine } from "@models/Machine";

const MachinesPage: NextPage = () => {
  return (
    <Dashboard>
      <div className="w-4/5 mx-auto">
        <TableComponent<Machine>
          path={"machine"}
          title={"Machines"}
          columns={["Id", "Name", "Zone", "Serial", "Manufacturer"]}
        >
          <MachineItems rows={[]} />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default MachinesPage;