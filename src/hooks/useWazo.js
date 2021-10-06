import React, { useState, useContext, createContext } from 'react';

import {getStoredValue, removeStoredValue, storeValue} from '../utils';
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
  const [room, setRoom] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const goSettings = () => setPage(SETTINGS);
  const goMain = () => setPage(MAIN);
  const goLogin = () => setPage(LOGIN);

  const login = async (loginInput: LoginInput) => {
    setState(loginInput);
    setLoading(true);

    Wazo.Auth.setHost(loginInput.server);

    try {
      const newSession = await Wazo.Auth.logIn(loginInput.username, loginInput.password);

      storeValue('token', newSession.token);
      storeValue('refreshToken', newSession.refreshToken);
      storeValue('server', loginInput.server);

      const newRooms = await new Promise(resolve => setTimeout(() => resolve([
        { id: '1', label: 'Room 1' },
        { id: '2', label: 'Room 2' },
        { id: '3', label: 'Room 3' },
        ]), 50)
      );

      setRooms(newRooms);
      setLoading(false);

      goMain();
    } catch (error) {
      console.error('Auts error', error);
      setLoading(false);
      return;
    }
  };

  const logout = () => {
    removeStoredValue('token');
    removeStoredValue('refreshToken');
    goLogin();
  }

  const redirectExistingSession = async (server, token) => {
    Wazo.Auth.setHost(server)
    const refreshToken = getStoredValue('refreshToken');
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

  const onRoomChange = newRoom => setRoom(newRoom);

  const value = { page, setPage, login, logout, redirectExistingSession, username, server, goSettings, goMain, rooms, room, onRoomChange, loading };

  return (
    <WazoContext.Provider value={value}>
      {children}
    </WazoContext.Provider>
  );
}

const useWazo = () => useContext(WazoContext);

export default useWazo;
