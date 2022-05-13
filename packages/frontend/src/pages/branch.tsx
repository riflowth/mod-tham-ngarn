import { BranchTable } from '@components/branch/BranchTable';
import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';

const BranchPage: NextPage = () => {
  return (
    <Dashboard>
      <BranchTable />
    </Dashboard>
  );
};

export default BranchPage;
