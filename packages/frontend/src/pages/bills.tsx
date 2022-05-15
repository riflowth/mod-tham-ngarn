import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { BillItems } from "@components/bill/BillItems";
import { Bill } from "@models/Bill";
import { withUser } from "@components/hoc/withUser";
import { BillModal } from "@components/bill/BillModal";

const BillsPage: NextPage = () => {
  return (
    <Dashboard current="Bill">
      <div className="w-full p-8 overflow-y-auto">
        <TableComponent<Bill>
          path={"bill"}
          title={"Bills"}
          columns={["", "Id", "Store", "Order by", ""]}
        >
          <BillItems rows={[]} />
          <BillModal />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(BillsPage);
