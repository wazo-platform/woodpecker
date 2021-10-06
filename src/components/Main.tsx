import React, {useEffect, useState} from 'react';
import {
  Button,
  Center,
  Heading,
  VStack,
} from 'native-base';
import Wazo from '@wazo/sdk/lib/simple';

import useWazo from '../hooks/useWazo';
import useShortcut from '../hooks/useShortcut';

let room: Wazo.Room;

const Main = () => {
  const { goSettings, logout } = useWazo();
  const [ready, setReady] = useState(false);
  const [talking, setTalking] = useState(false);
  const keyDown = useShortcut('ctrl+j', talking);

  useEffect(() => {
    if (keyDown) {
      setTalking(true);
    } else {
      setTalking(false);
    }
  }, [keyDown]);

  useEffect(() => {
    if (talking) {
      room?.unmute();
    } else {
      room?.mute();
    }
  }, [talking]);

  useEffect(() => {
    (async () => {
      room = await Wazo.Room.connect({ extension: '9000', constraints: { audio: true }, audioOnly: true });

      room.on(room.ON_JOINED, () => {
        room.mute();
        setReady(true);
      });
    })();

    window.addEventListener('beforeunload', (event) => {
      if (room) {
        event.preventDefault();
        // $FlowFixMe
        event.returnValue = '';

        return true;
      }

      room?.disconnect();

      // $FlowFixMe
      delete event.returnValue;
      return false;
    });

    window.addEventListener('unload', () => {
      room?.disconnect();
    });
  }, []);

  const onLogout = () => {
    room?.disconnect();
    logout();
  }

  const disabled = !ready;

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
          <Button isDisabled={disabled} onPressIn={() => setTalking(true)} onPressOut={() => setTalking(false)}>
            {talking ? 'Talking': 'Talk'}
          </Button>
          <Button onPress={onLogout}>Logout</Button>
        </VStack>
      </Center>
  );
}

export default Main;
