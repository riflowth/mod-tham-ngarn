import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';
import { Disclosure } from '@headlessui/react';
import { TableComponent } from '@components/table/TableComponent';
import { BillItems } from "@components/bill/BillItems";
import { Bill } from "@models/Bill";

const BillsPage: NextPage = () => {
  return (
      <Dashboard>
        <TableComponent<Bill>
          path={'bill'}
          title={'Bills'} 
          columns={['Id', 'Stroe', 'Oredered by']} 
        >
          <BillItems rows={[]} />
        </TableComponent> 
      </Dashboard>
  );
}

export default BillsPage;
