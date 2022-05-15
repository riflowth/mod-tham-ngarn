import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { StaffItems } from "@components/staff/StaffItems";
import { Staff } from "@models/Staff";
import { withUser } from "@components/hoc/withUser";

const StaffsPage: NextPage = () => {
  return (
    <Dashboard current="Staff">
      <div className="w-full p-8 overflow-y-auto">
        <TableComponent<Staff>
          path={"staff"}
          title={"Staffs"}
          columns={[
            "",
            "Id",
            "First Name",
            "Last Name",
            "Branch",
            "Zone",
            "Position",
            "",
            "",
          ]}
        >
          <StaffItems rows={[]} />
          <div>deleteme</div>
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(StaffsPage);
