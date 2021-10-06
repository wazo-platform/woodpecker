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
import { storeValue } from "./src/utils";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: localStorage.getItem('colorMode') || 'dark',
};

// extend the theme
export const theme = extendTheme({ config });

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
