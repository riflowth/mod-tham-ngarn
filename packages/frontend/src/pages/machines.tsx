import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { MachineItems } from "@components/machine/MachineItems";
import { Machine } from "@models/Machine";
import { withUser } from '@components/hoc/withUser';

const MachinesPage: NextPage = () => {
  return (
    <Dashboard current="Machine">
      <div className="p-8 overflow-y-auto">
        <TableComponent<Machine>
          path={"machine"}
          title={"Machines"}
          columns={["Id", "Name", "Zone", "Serial", "Manufacturer"]}
        >
          <MachineItems rows={[]} />
          <div>deleteme</div>
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(MachinesPage);
