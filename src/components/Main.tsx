import React, {useEffect, useState} from 'react';
import {
  Button,
  Center,
  Heading,
  VStack,
  HStack,
  Box,
  IconButton,
  Icon,
} from 'native-base';
import Wazo from '@wazo/sdk/lib/simple';
import { AntDesign } from "@expo/vector-icons"

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
      try {
        const newRoom = await Wazo.Room.connect({ extension: roomNumber });
        console.log('newRoom', newRoom);

        newRoom.on(newRoom.ON_JOINED, () => {
          newRoom.mute();
          setReady(true);
        });

        setRoom(newRoom);
      } catch(e) {
        console.log('e', e);
      }

    })();

    if (typeof window !== 'undefined' && window.addEventListener) {
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
    }
  }, []);

  const onLogout = () => {
    room?.disconnect();
    setRoom(null);
    logout();
  }

  const disabled = !ready;

  return (
    <Box flex={1} bg="white" safeAreaTop>
      <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <Heading size="lg">{ready ? roomNumber : `Connecting to ${roomNumber}...`}</Heading>
          <Button size="lg" isDisabled={disabled} onPressIn={() => setTalking(true)} onPressOut={() => setTalking(false)}>
            {talking ? 'Talking': 'Talk'}
          </Button>
        </VStack>
      </Center>
      <HStack bg="indigo.600" justifyContent="flex-end" alignItems="center" safeAreaBottom shadow={6} space="sm" style={{ height: 60}}>
        <IconButton
          variant="ghost"
          onPress={goSettings}
          icon={<Icon size="md" as={<AntDesign name="setting" />} color="white" />}
        />
        <IconButton
          variant="ghost"
          onPress={onLogout}
          icon={<Icon size="md" as={<AntDesign name="logout" />} color="white" />}
        />
      </HStack>
    </Box>
  );
}

export default Main;
