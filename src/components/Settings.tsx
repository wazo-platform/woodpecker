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
  IconButton,
  Icon,
} from "native-base";
import { AntDesign } from "@expo/vector-icons"

import useWazo from "../hooks/useWazo";
import { storeValue } from "../utils";

const Main = () => {
  const { goMain, roomNumber, rooms, onRoomChange } = useWazo();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box flex={1} bg="white" safeAreaBottom>
      <HStack bg="indigo.600" alignItems="center" safeAreaTop shadow={6} style={{ height: 60 }}>
        <IconButton
          variant="ghost"
          onPress={goMain}
          icon={<Icon size="md" as={<AntDesign name="arrowleft" />} color="white" />}
        />
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
