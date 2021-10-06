import React, { useState, useEffect, useContext, createContext } from 'react';
import { useColorMode } from 'native-base';


import useSetState from './useSetState';
import { getStoredValue, removeStoredValue, storeValue } from '../utils';

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
  const { colorMode, toggleColorMode } = useColorMode();

  setInterval(() => {
    toggleColorMode()
  }, 1000)

  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const goSettings = async () => {
    if (!rooms?.length) {
      console.log('acquiring rooms...');
      const source = await Wazo.getApiClient().dird.fetchConferenceSource(session.primaryContext());
      const newRooms = await Wazo.getApiClient().dird.fetchConferenceContacts(source.items[0]);
      const formattedRooms = newRooms.map(contact => ({ label: contact.name, id: contact.sourceId }));
      setRooms(formattedRooms);
    }
    setPage(SETTINGS);
  }
  const goMain = () => setPage(MAIN);
  const goLogin = () => setPage(LOGIN);

  const login = async (loginInput: LoginInput) => {
    setState(loginInput);
    setLoading(true);

    Wazo.Auth.setHost(loginInput.server);

    try {
      const newSession = await Wazo.Auth.logIn(loginInput.username, loginInput.password);
      setSession(newSession);

      storeValue('token', newSession.token);
      storeValue('refreshToken', newSession.refreshToken);
      storeValue('server', loginInput.server);

      setLoading(newSession);

      onLogin();
    } catch (error) {
      console.error('Auts error', error);
      setLoading(false);
      return;
    }
  };

  const onLogin = () => {
    if (!room) {
      goSettings();
      return;
    }

    goMain();
  }

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
      if (!existingSession) {
        throw new Error('Empty session');
      }
      setSession(existingSession);
    } catch (error) {
      console.error('Token validation error', error);
      return;
    }
  }

  const onRoomChange = newRoom => setRoom(newRoom);

  useEffect(() => {
    if (colorMode) {
      storeValue('colorMode', colorMode);
    }
  }, [colorMode])

  useEffect(() => {
    if (room) {
      storeValue('room', room);
    }
  }, [room])

  useEffect(() => {
    if (session) {
      onLogin();
    }
  }, [session])

  const value = { page, setPage, login, logout, redirectExistingSession, username, server, goSettings, goMain, rooms, room, onRoomChange, loading, colorMode, toggleColorMode };

  return (
    <WazoContext.Provider value={value}>
      {children}
    </WazoContext.Provider>
  );
}

const useWazo = () => useContext(WazoContext);

export default useWazo;
