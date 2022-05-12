import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';
import { Disclosure } from '@headlessui/react';
import { TableTest } from '@components/table/Table';

const UsersPage: NextPage = () => {
  return (
      <Dashboard>
        <TableTest />
      </Dashboard>
  );
}

export default UsersPage;
