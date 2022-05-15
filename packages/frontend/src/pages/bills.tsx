import { Dashboard } from "@components/dashboard/Dashboard";
import { NextPage } from "next";
import { TableComponent } from "@components/table/TableComponent";
import { BillItems } from "@components/bill/BillItems";
import { Bill } from "@models/Bill";
import { withUser } from "@components/hoc/withUser";

const BillsPage: NextPage = () => {
  return (
    <Dashboard>
      <div className="w-3/5 mx-auto">
        <TableComponent<Bill>
          path={"bill"}
          title={"Bills"}
          columns={["", "Id", "Stroe", "Oredered by"]}
        >
          <div>deleteme</div>
          <BillItems rows={[]} />
        </TableComponent>
      </div>
    </Dashboard>
  );
};

export default withUser(BillsPage);
