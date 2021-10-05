import React from "react";
import {
  Button,
  Center,
  Heading,
  VStack,
} from "native-base";
import useWazo from "../hooks/useWazo";

const Main = () => {
  const { goSettings, logout } = useWazo();
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
          <Button onPress={logout}>Logout</Button>
        </VStack>
      </Center>
  );
}

export default Main;
