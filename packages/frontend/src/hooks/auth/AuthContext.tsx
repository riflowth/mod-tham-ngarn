import fetch from '@utils/Fetch';
import { useRouter } from 'next/router';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

type User = {
  staffId: number,
  name: string,
  zoneId: number,
  branchId: number,
  role: string,
};

type AuthContextType = {
  user?: User,
  setUser: Dispatch<SetStateAction<User | undefined>>,
  login: (username: string, password: string) => Promise<Error>,
  logout: () => Promise<void>,
  error?: any,
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({
  children,
}: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>();

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

  useEffect(() => {
    if (error) setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const login = async (username: string, password: string) => {
    try {
      await fetch.post('/auth/login', {
        username, password
      });
      const response = await fetch.get('/auth/me');
      setUser(response.data.data);
    } catch (error: any) {
      setError(error);
      return error;
    }
  };

  const logout = async () => {
    const response = await fetch.get('/auth/logout');
    if (response.status === 200) {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
