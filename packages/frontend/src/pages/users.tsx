import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';
import { Disclosure } from '@headlessui/react';
import { TableComponent } from '@components/table/TableComponent';

function createData(
  staffid: number,
  firstname: string,
  lastname: string,
  zoneid: number,
  branchid: number,
  telno: string
) {
  return { staffid, firstname, lastname, zoneid, branchid, telno };
}

const rows = [
  createData(1, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(2, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(3, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(4, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(5, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(6, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(7, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(8, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(9, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(10, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(11, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(12, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(13, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(14, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
].sort((a, b) => (a.staffid < b.staffid ? -1 : 1));

const UsersPage: NextPage = () => {
  return (
      <Dashboard>
        <TableComponent title={"Users"} columns={['id', 'yo',	'LastName',	'ZoneId',	'BranchId',	'Tel-no',	'faef']} rows={rows} style={''}/>
      </Dashboard>
  );
}

export default UsersPage;
