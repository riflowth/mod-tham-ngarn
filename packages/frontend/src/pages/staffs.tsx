import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';
import { Disclosure } from '@headlessui/react';
import { TableComponent } from '@components/table/TableComponent';
import { StaffItems } from "@components/staff/StaffItems";
import { Staff } from "@models/Staff";

const StaffsPage: NextPage = () => {
  return (
      <Dashboard>
        <TableComponent<Staff>
          path={'staff'}
          title={'Staffs'} 
          columns={['Id', 'First Name', 'Last Name', 'Branch', 'Zone', 'Position']} 
        >
          <StaffItems rows={[]} />
        </TableComponent> 
      </Dashboard>
  );
}

export default StaffsPage;
