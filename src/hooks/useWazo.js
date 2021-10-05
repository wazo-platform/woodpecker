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

  const login = async (loginInput: LoginInput) => {
    Wazo.Auth.setHost(loginInput.server);

    try {
      const newSession = await Wazo.Auth.logIn(loginInput.username, loginInput.password);

      localStorage.setItem('token', newSession.token);
      localStorage.setItem('refreshToken', newSession.refreshToken);
      localStorage.setItem('server', loginInput.server);

      goMain();
    } catch (error) {
      console.error('Auts error', error);
      return;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    goLogin();
  }

  const redirectExistingSession = async (server, token) => {
    Wazo.Auth.setHost(server)
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const existingSession = await Wazo.Auth.validateToken(token, refreshToken);
      if (existingSession) {
        goMain();
      }
    } catch (error) {
      console.error('Token validation error', error);
      return;
    }
  }

  const value = { page, setPage, login, logout, redirectExistingSession, username, server, goSettings, goMain };

  return (
    <WazoContext.Provider value={value}>
      {children}
    </WazoContext.Provider>
  );
}

const useWazo = () => useContext(WazoContext);

export default useWazo;
