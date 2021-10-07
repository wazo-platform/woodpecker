import React, { useState, useEffect, useContext, createContext } from 'react';
import { useColorMode } from 'native-base';

import useSetState from './useSetState';
import useShortcut from '../hooks/useShortcut';
import { getStoredValue, removeStoredValue, storeValue, isMobile } from '../utils';

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

// Polyfill webrtc
if (isMobile) {
  const MediaStreamTrackEvent = require('react-native-webrtc/src/MediaStreamTrackEvent').default;
  const MediaStreamTrack = require('react-native-webrtc/src/MediaStreamTrack').default;
  const { RTCPeerConnection, RTCSessionDescription, MediaStream, mediaDevices } = require('react-native-webrtc');

  global.MediaStream = MediaStream;
  global.MediaStreamTrack = MediaStreamTrack;
  global.RTCSessionDescription = RTCSessionDescription;
  global.RTCPeerConnection = RTCPeerConnection;
  global.window.RTCPeerConnection = RTCPeerConnection;
  if (global.navigator) {
    global.navigator.mediaDevices = {
      ...global.navigator.mediaDevices || {},
      getUserMedia: mediaDevices.getUserMedia,
    };
  } else {
    global.navigator = {};
  }
  global.MediaStreamTrackEvent = MediaStreamTrackEvent;
  console.log('MediaStreamTrackEvent', MediaStreamTrackEvent);
}

export const WazoProvider = ({ value: { page, setPage }, children }) => {
  const [{ username, password, server }, setState] = useSetState({});

  const [roomNumber, setRoomNumber] = useState('');
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const [ready, setReady] = useState(false);
  const [talking, setTalking] = useState(false);
  const keyDown = useShortcut('ctrl+j', talking);

  const goSettings = async () => {
    if (!rooms?.length) {
      console.log('acquiring rooms...');
      const source = await Wazo.getApiClient().dird.fetchConferenceSource(session.primaryContext());
      const newRooms = await Wazo.getApiClient().dird.fetchConferenceContacts(source.items[0]);
      const formattedRooms = newRooms.map(contact => ({ label: contact.name, id: `${contact.number}` }));
      setRooms(formattedRooms);
    }
    setPage(SETTINGS);
  }

  const connectToRoom = async () => {
    if (room) {
      return;
    }

    console.log('connecting to room...');

    try {
      const newRoom = await Wazo.Room.connect({ extension: roomNumber });
      console.log('newRoom', newRoom);

      newRoom.on(newRoom.ON_JOINED, () => {
        newRoom.mute();
        setReady(true);
      });

      setRoom(newRoom);
    } catch(e) {
      console.log('e', e);
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('beforeunload', (event) => {
        if (room) {
          event.preventDefault();
          event.returnValue = '';
          return true;
        }

        room?.disconnect();

        delete event.returnValue;
        return false;
      });

      window.addEventListener('unload', () => {
        room?.disconnect();
      });
    }
  }

  const goMain = () => {
    connectToRoom();    
    setPage(MAIN);
  }

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
      console.error('Auth error', error);
      setLoading(false);
      return;
    }
  };

  const onLogin = async () => {
    const storedRoomNumber = await getStoredValue('roomNumber');
    if (storedRoomNumber) {
      setRoomNumber(`${storedRoomNumber}`);
    }

    if (!storedRoomNumber) {
      goSettings();
      return;
    }

    goMain();
  }

  const logout = () => {
    room?.disconnect();
    setRoom(null);
    removeStoredValue('token');
    removeStoredValue('refreshToken');
    goLogin();
  }

  const redirectExistingSession = async (server, token) => {
    Wazo.Auth.setHost(server)
    const refreshToken = await getStoredValue('refreshToken');
    try {
      const existingSession = await Wazo.Auth.validateToken(token, refreshToken);
      if (!existingSession) {
        return;
      }
      setSession(existingSession);
    } catch (error) {
      console.error('Token validation error', error);
      return;
    }
  }

  const onRoomChange = newRoomNumber => {
    if (room) {
      room.disconnect();
    }
    setRoomNumber(newRoomNumber);
  }

  useEffect(() => {
    if (roomNumber) {
      storeValue('roomNumber', roomNumber);
    }
  }, [roomNumber])

  useEffect(() => {
    if (session) {
      onLogin();
    }
  }, [session])

  /////////// Imported from Main
  useEffect(() => {
    if (keyDown) {
      setTalking(true);
    } else {
      setTalking(false);
    }
  }, [keyDown]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (talking) {
      room?.unmute();
    } else {
      room?.mute();
    }
  }, [talking, ready]);
  ///////////

  const value = { page, setPage, login, logout, redirectExistingSession, username, server, goSettings, goMain, rooms, roomNumber, onRoomChange, loading, setState, room, setRoom, talking, ready, setTalking };

  return (
    <WazoContext.Provider value={value}>
      {children}
    </WazoContext.Provider>
  );
}

const useWazo = () => useContext(WazoContext);

export default useWazo;
