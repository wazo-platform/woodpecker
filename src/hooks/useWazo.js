import React, { useContext, createContext } from 'react';
import useSetState from './useSetState';

export const LOGIN = 'page/LOGIN';
export const SETTINGS = 'page/SETTINGS';
export const MAIN = 'page/MAIN';

const WazoContext = createContext({});

type LoginInput = {
  username: string,
  password: string, 
  server: string,
};

type WazoContextType = {
  page: string,
  setPage: Function,
  login: Function, 
  username: string,
  server: string,
};

export const WazoProvider = ({ value: { page, setPage }, children }) => {
  const [{ username, password, server }, setState] = useSetState({});
  const goSettings = () => setPage(SETTINGS);
  const goMain = () => setPage(MAIN);
  const goLogin = () => setPage(LOGIN);

  const login = (loginInput: LoginInput) => {
    setState(loginInput);
    goMain();
  };

  const logout = () => {
    goLogin();
  }

  const value = { page, setPage, login, logout, username, server, goSettings, goMain };
 
  return (
    <WazoContext.Provider value={value}>
      {children}
    </WazoContext.Provider>
  );
}

const useWazo = () => useContext(WazoContext);

export default useWazo;
