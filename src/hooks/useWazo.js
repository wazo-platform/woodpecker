import React, { useState, useContext, createContext } from 'react';
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

    const success = await new Promise(resolve => setTimeout(async () => {

      const newRooms = await new Promise(roomResolve => setTimeout(() => roomResolve([
        { id: '1', label: 'Room 1' }, 
        { id: '2', label: 'Room 2' }, 
        { id: '3', label: 'Room 3' }, 
        ]), 50)
      );

      setRooms(newRooms);
      setLoading(false);

      resolve(true);
    }), 2000);

    if (success) {
      goMain();
    }
  };

  const logout = () => {
    goLogin();
  }

  const onRoomChange = newRoom => setRoom(newRoom);

  const value = { page, setPage, login, logout, username, server, goSettings, goMain, rooms, room, onRoomChange, loading };
 
  return (
    <WazoContext.Provider value={value}>
      {children}
    </WazoContext.Provider>
  );
}

const useWazo = () => useContext(WazoContext);

export default useWazo;
