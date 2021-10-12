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
  Text,
} from 'native-base';
import Wazo from '@wazo/sdk/lib/simple';
import { AntDesign, Entypo } from "@expo/vector-icons"

import useWazo from '../hooks/useWazo';

const buttonStyle = disabled => ({
  background: 'transparent',
  pointerEvents: disabled ? 'none' : 'auto'
});

const iconStyle = (talking, disabled) => ({
  width: 320,
  height: 320,
  lineHeight: 320,
  fontSize: 320,
  color: talking ? '#9c0' : disabled ? '#ccc' : '#6bd',
  textShadow: talking || disabled ? 'none' : '0 10px 20px rgba(0,0,0,.3)',
  background: 'transparent',
});

const Main = () => {
  const { goSettings, logout, roomNumber, talking, ready, setTalking } = useWazo();
  const disabled = !ready;

  return (
    <Box flex={1} bg="white" safeAreaTop>
      <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center" justifyContent="center">
          <Heading size="lg">{ready ? roomNumber : `Connecting to ${roomNumber}...`}</Heading>

          <IconButton
            variant="ghost"
            onPressIn={() => setTalking(true)}
            onPressOut={() => setTalking(false)}
            style={buttonStyle(disabled)}
            icon={<Icon as={<Entypo name="flickr-with-circle" />} color="black" style={iconStyle(talking, disabled)} />}
          />

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
          onPress={logout}
          icon={<Icon size="md" as={<AntDesign name="logout" />} color="white" />}
        />
      </HStack>
    </Box>
  );
}

export default Main;
