import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { LoadingScreen } from '@components/LoadingScreen';
import { useAuth } from '@hooks/auth/AuthContext';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  return (
    <Dashboard />
  );
};

export default withUser(IndexPage);
