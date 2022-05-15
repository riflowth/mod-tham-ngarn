import { LoadingScreen } from '@components/LoadingScreen';
import { useAuth } from '@hooks/auth/AuthContext';
import fetch from '@utils/Fetch';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withUser = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { user, setUser } = useAuth();

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const response = await fetch.get('/auth/me');
          setUser(response.data.data);
        } catch {
          router.replace('/login');
        }
      };
      loadUserData();
    }, []);

    if (!user) return <LoadingScreen />;

    return <WrappedComponent {...props} />
  };

  return Wrapper;
};
