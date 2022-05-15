import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  return (
    <Dashboard current="Home">
      <div></div>
    </Dashboard>
  );
};

export default withUser(IndexPage);
