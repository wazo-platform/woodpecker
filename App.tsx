import React, { useState } from "react";
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
import NativeBaseIcon from "./components/NativeBaseIcon";

import Main from './components/Main';
import Login from './components/Login';
import Settings from './components/Settings';
import { WazoProvider, LOGIN, SETTINGS, MAIN } from './hooks/useWazo';
import Wazo from '@wazo/sdk/lib/simple';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

Wazo.Auth.init('woodpecker');

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
