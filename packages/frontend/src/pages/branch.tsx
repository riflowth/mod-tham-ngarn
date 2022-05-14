import { BranchBoard } from '@components/branch/BranchBoard';
import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { NextPage } from 'next';

const BranchPage: NextPage = () => {
  return (
    <Dashboard>
      <BranchBoard />
    </Dashboard>
  );
};

export default withUser(BranchPage);
