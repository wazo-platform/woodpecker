import React from "react";
import {
  Text,
  HStack,
  Center,
  Heading,
  Switch,
  VStack,
  Button,
  Select,
  CheckIcon,
  useColorMode,
} from "native-base";
import useWazo from "../hooks/useWazo";
import { storeValue } from "../utils";

const Main = () => {
  const { goMain, room, rooms, onRoomChange } = useWazo();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <Heading size="lg">Settings</Heading>

          <HStack space={2} alignItems="center">
            <Text>Dark</Text>
            <Switch
              isChecked={colorMode === "light" ? false : true}
              onToggle={() => {
                console.log('clide', colorMode);
                storeValue('colorMode', colorMode)
                toggleColorMode()
              }}
              aria-label={
                colorMode === "light" ? "switch to dark mode" : "switch to light mode"
              }
            />
            <Text>Light</Text>
          </HStack>

          <Select
            selectedValue={room}
            minWidth="200"
            placeholder="Choose room"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={onRoomChange}
          >
            {rooms.map(({ id, label }) => <Select.Item label={label} value={id} key={id} />)}
          </Select>

          <Button onPress={goMain}>Back to Main</Button>
        </VStack>
      </Center>
  );
}

export default Main;
