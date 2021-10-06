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

const Main = () => {
  const { goSettings, logout, roomNumber, room, setRoom } = useWazo();
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
    if (!ready) {
      return;
    }
    if (talking) {
      room?.unmute();
    } else {
      room?.mute();
    }
  }, [talking, ready]);

  useEffect(() => {
    (async () => {
      const newRoom = await Wazo.Room.connect({ extension: roomNumber });

      newRoom.on(newRoom.ON_JOINED, () => {
        newRoom.mute();
        setReady(true);
      });

      setRoom(newRoom);
    })();

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
  }, []);

  const onLogout = () => {
    room?.disconnect();
    setRoom(null);
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
          <Heading size="lg">{ready ? roomNumber : `Connecting to ${roomNumber}...`}</Heading>
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
