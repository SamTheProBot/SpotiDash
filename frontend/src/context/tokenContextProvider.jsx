import { useEffect, useState } from 'react';
import { TokenContext } from './Context';

const TokenContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('Token'));

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem('Token'));
    };
    window.addEventListener('storage', syncToken);
    syncToken();
    return () => {
      window.removeEventListener('storage', syncToken);
    };
  }, []);

  return (
    <>
      <TokenContext.Provider value={{ token, setToken }}>
        {children}
      </TokenContext.Provider>
    </>
  );
};

export default TokenContextProvider;
