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
  Select,
  CheckIcon,
} from "native-base";
import useWazo from "../hooks/useWazo";

const Main = () => {
  const { goMain, room, rooms, onRoomChange } = useWazo();
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
          
          <Select
            selectedValue={room}
            minWidth="200"
            accessibilityLabel="Choose room"
            placeholder="Choose room"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={itemValue => onRoomChange(itemValue)}
          >
            {rooms.map(({ id, label }) => <Select.Item label={label} value={id} />)}
          </Select>

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
