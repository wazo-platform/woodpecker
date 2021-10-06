import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import {
  Center,
  Heading,
  VStack,
  Input,
  Button,
  Text,
} from 'native-base';
import useWazo from '../hooks/useWazo';
import { getStoredValue } from '../utils';

const dark = { bg: "blueGray.900" };
const light = { bg: "blueGray.50" };
const isIOS = Platform.OS === 'ios';

const Main = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const { login, loading, redirectExistingSession } = useWazo();

  const onPress = () => {
    login({ username, password, server });
  }

  useEffect(() => {
    const server = getStoredValue('server');
    const token = getStoredValue('token');

    if (server && token) {
      redirectExistingSession(server, token);
    }
  }, []);


  return (
    <Center _dark={dark} _light={light} px={4} flex={1}>
      <VStack space={5} alignItems="center">
        <Heading size="lg">Login</Heading>
        <Input
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            variant="outline"
            placeholder="Username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            returnKeyLabel="next"
            returnKeyType="next"
        />
        <Input
            autoCapitalize="none"
            autoCorrect={false}
            variant="outline"
            placeholder="Password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            returnKeyLabel="next"
            returnKeyType="next"
        />
        <Input
            autoCapitalize="none"
            autoCorrect={false}
            variant="outline"
            placeholder="Server"
            value={server}
            keyboardType={isIOS ? 'url' : 'email-address'}
            onChange={event => setServer(event.target.value)}
            returnKeyLabel="send"
            returnKeyType="send"
        />
        {server ? (<Button onPress={onPress}>Go</Button>) : null}
        {loading && <Text>Loading...</Text>}
      </VStack>
    </Center>
  );
}

export default Main;
