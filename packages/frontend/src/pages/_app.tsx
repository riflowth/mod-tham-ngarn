import '@styles/globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from 'src/hooks/auth/AuthContext';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default App;
