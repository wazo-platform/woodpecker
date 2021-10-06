import React, {useEffect, useState} from 'react';
import {
  Button,
  Center,
  Heading,
  VStack,
} from 'native-base';
import useWazo from '../hooks/useWazo';
import useShortcut from '../hooks/useShortcut';

const Main = () => {
  const { goSettings, logout } = useWazo();
  const [talking, setTalking] = useState(false);
  const keyDown = useShortcut('ctrl+j', talking);

  useEffect(() => {
    if (keyDown) {
      setTalking(true);
    } else {
      setTalking(false);
    }
  }, [keyDown]);

  return (
    <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <Heading size="lg">Main</Heading>
          <Button onPress={goSettings}>Settings</Button>
          <Button onPressIn={() => setTalking(true)} onPressOut={() => setTalking(false)}>
            {talking ? 'Talking': 'Talk'}
          </Button>
          <Button onPress={logout}>Logout</Button>
        </VStack>
      </Center>
  );
}

export default Main;
