import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { StaffItems } from "@components/staff/StaffItems";
import { Staff } from "@models/Staff";
import { withUser } from '@components/hoc/withUser';
import { StaffModal } from '@components/staff/StaffModal';

const StaffsPage: NextPage = () => {
  return (
    <Dashboard current="Staff">
      <div className="p-6 overflow-y-auto w-full">
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
          ]}
        >
          <StaffItems rows={[]} />
          <StaffModal />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(StaffsPage);
