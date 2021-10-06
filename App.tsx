import React, { useState } from "react";
import Wazo from '@wazo/sdk/lib/simple';
import {
  NativeBaseProvider,
  extendTheme,
  useColorMode,
} from "native-base";

import Main from './src/components/Main';
import Login from './src/components/Login';
import Settings from './src/components/Settings';
import { WazoProvider, LOGIN, SETTINGS, MAIN } from './src/hooks/useWazo';
import {storeValue, getStoredValue} from "./src/utils";

export let theme;

const setupTheme = async () => {
  // Define the config
  const initialColorMode = await getStoredValue('colorMode') || 'dark';
  const config = {
    useSystemColorMode: false,
    initialColorMode,
  };
  
  // extend the theme
  theme = extendTheme({ config });
}

setupTheme();

Wazo.Auth.init('woodpecker', 10);
Wazo.Auth.setOnRefreshToken((token:string) => {
  storeValue('token', token);
});

export default function App() {
  const [page, setPage] = useState(LOGIN);
 
  return (
    <WazoProvider value={{ page, setPage }}>
      <NativeBaseProvider theme={theme}>
        {page === LOGIN && <Login />}
        {page === SETTINGS && <Settings />}
        {page === MAIN && <Main />}
      </NativeBaseProvider>
    </WazoProvider>
  );
}
