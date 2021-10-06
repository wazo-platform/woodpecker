import React from "react";
import {
  Text,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  VStack,
  Button,
} from "native-base";
import useWazo from "../hooks/useWazo";

const Main = () => {
  const { goMain } = useWazo()
  return (
    <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <Heading size="lg">Settings</Heading>
          <ToggleDarkMode />
          <Button onPress={goMain}>Back to Main</Button>
        </VStack>
      </Center>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light" ? true : false}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}

export default Main;