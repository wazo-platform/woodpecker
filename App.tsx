import React, { useState } from "react";
import Wazo from '@wazo/sdk/lib/simple';
import {
  NativeBaseProvider,
  extendTheme,
} from "native-base";

import Main from './src/components/Main';
import Login from './src/components/Login';
import Settings from './src/components/Settings';
import { WazoProvider, LOGIN, SETTINGS, MAIN } from './src/hooks/useWazo';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};
const isMobile = typeof navigator != 'undefined' && navigator.product == 'ReactNative';

// extend the theme
export const theme = extendTheme({ config });

Wazo.Auth.init('woodpecker');

// Electron
if (!isMobile && window.require) {
  // Trick to avoid requiring electron in mobile
  System.import('electron').then(electron => {
    electron.ipcRenderer.on('electron-keyup', (event, message) => {
      console.log('electron-keyup', message);
    });
    electron.ipcRenderer.on('electron-keydown', (event, message) => {
      console.log('electron-keydown', message);
    });
  });
}

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
