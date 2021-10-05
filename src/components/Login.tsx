import React, { useState } from "react";
import {
  Center,
  Heading,
  VStack,
  Input,
  Button,
  Text,
} from "native-base";
import useWazo from "../hooks/useWazo";

const Main = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const { login, loading } = useWazo();

  const onPress = () => {
    login({ username, password, server });
  }

  return (
    <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <Heading size="lg">Login</Heading>
          <Input variant="outline" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} />
          <Input variant="outline" placeholder="Password" type="password" value={password} onChange={event => setPassword(event.target.value)} />
          <Input variant="outline" placeholder="Server" value={server} onChange={event => setServer(event.target.value)} />
          <Button onPress={onPress}>Go</Button>
          {loading && <Text>Loading...</Text>}
        </VStack>
      </Center>
  );
}

export default Main;
