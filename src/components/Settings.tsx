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
  Box,
} from "native-base";
import useWazo from "../hooks/useWazo";
import { storeValue } from "../utils";

const Main = () => {
  const { goMain, roomNumber, rooms, onRoomChange } = useWazo();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box flex={1} bg="white" safeAreaBottom>
      <HStack bg="indigo.600" alignItems="center" safeAreaTop shadow={6}>
        <Button variant="ghost" onPress={goMain}>Back</Button>
      </HStack>

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
              isChecked={colorMode === "light" ? true : false}
              onToggle={async () => {
                if (colorMode) {
                  await storeValue('colorMode', colorMode)
                }
                toggleColorMode();
              }}
              aria-label={
                colorMode === "light" ? "switch to dark mode" : "switch to light mode"
              }
            />
            <Text>Light</Text>
          </HStack>

          <Select
            selectedValue={roomNumber}
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

        </VStack>
      </Center>
    </Box>
  );
}

export default Main;
