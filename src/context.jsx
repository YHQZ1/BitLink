import { createContext, useContext, useEffect } from 'react';
import useFetch from './hooks/use-fetch';
import { getCurrentUser } from './db/apiAuth';

const URLContext = createContext();

const URLProvider = ({ children }) => {

  const {data: user, loading, fn: fetchUser} = useFetch(getCurrentUser);
  const isAuthenticated = user?.role === 'authenticated';
  
  useEffect(() => {
    fetchUser();
  }, []);

  return <URLContext.Provider value={{user, fetchUser, loading, isAuthenticated}}>{children}</URLContext.Provider>
};

export const URLState = () => {
  return useContext(URLContext);
};

export default URLProvider;