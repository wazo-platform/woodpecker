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
          onPress={logout}
          icon={<Icon size="md" as={<AntDesign name="logout" />} color="white" />}
        />
      </HStack>
    </Box>
  );
}

export default Main;
