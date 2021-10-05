import React, { useState } from "react";
import Wazo from '@wazo/sdk/lib/simple';
import electron from 'electron';
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Code,
} from "native-base";
import NativeBaseIcon from "./src/components/NativeBaseIcon";

import Main from './src/components/Main';
import Login from './src/components/Login';
import Settings from './src/components/Settings';
import { WazoProvider, LOGIN, SETTINGS, MAIN } from './src/hooks/useWazo';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

Wazo.Auth.init('woodpecker');

electron.ipcRenderer.on('electron-keyup', (event, message) => {
  console.log('electron-keyup', message);
});
electron.ipcRenderer.on('electron-keydown', (event, message) => {
  console.log('electron-keydown', message);
});

export default function App() {
  const [page, setPage] = useState(LOGIN);
  return (
    <WazoProvider value={{ page, setPage }}>
      <NativeBaseProvider>
        {page === LOGIN && <Login />}
        {page === SETTINGS && <Settings />}
        {page === MAIN && <Main />}
      </NativeBaseProvider>
    </WazoProvider>
  );
}
