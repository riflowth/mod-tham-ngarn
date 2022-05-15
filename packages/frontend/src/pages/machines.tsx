import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { MachineItems } from "@components/machine/MachineItems";
import { Machine } from "@models/Machine";
import { withUser } from "@components/hoc/withUser";

const MachinesPage: NextPage = () => {
  return (
    <Dashboard>
      <div className="w-4/5 mx-auto">
        <TableComponent<Machine>
          path={"machine"}
          title={"Machines"}
          columns={["Id", "Name", "Zone", "Serial", "Manufacturer"]}
        >
          <div>deleteme</div>
          <MachineItems rows={[]} />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(MachinesPage);
