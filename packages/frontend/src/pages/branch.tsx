import { BranchBoard } from '@components/branch/BranchBoard';
import { Dashboard } from '@components/dashboard/Dashboard';
import { NextPage } from 'next';

const BranchPage: NextPage = () => {
  return (
    <Dashboard>
      <BranchBoard />
    </Dashboard>
  );
};

export default BranchPage;
