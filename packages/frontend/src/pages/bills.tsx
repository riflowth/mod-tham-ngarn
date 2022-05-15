import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { BillItems } from "@components/bill/BillItems";
import { Bill } from "@models/Bill";
import { withUser } from "@components/hoc/withUser";

const BillsPage: NextPage = () => {
  return (
    <Dashboard current="Bill">
      <div className="p-8 overflow-y-auto w-full">
        <TableComponent<Bill>
          path={"bill"}
          title={"Bills"}
          columns={["", "Id", "Stroe", "Oredered by", "", ""]}
        >
          <div>deleteme</div>
          <BillItems rows={[]} />
          <div>deleteme</div>
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(BillsPage);
