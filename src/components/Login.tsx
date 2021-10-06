import React, { useState } from 'react';
import {
  Center,
  Heading,
  VStack,
  Input,
  Button,
} from 'native-base';
import useWazo from '../hooks/useWazo';

const audio = document.createElement('audio');
audio.src = require('../../assets/silence.mp3');
audio.loop = true;

// Browser not focused
if (navigator.mediaSession) {
  navigator.mediaSession.setActionHandler('play', async function() {
    console.log('> User clicked "Play" icon.');
    await audio.play();
  });

  navigator.mediaSession.setActionHandler('pause', function() {
    console.log('> User clicked "Pause" icon.');
    audio.pause();
  });

  audio.addEventListener('play', function() {
    navigator.mediaSession.playbackState = 'playing';
  });

  audio.addEventListener('pause', function() {
    navigator.mediaSession.playbackState = 'paused';
  });
}

const Main = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const { login } = useWazo();

  const onPress = () => {
    login({ username, password, server });

    audio.play().catch(error => console.log(error));
  }

  return (
    <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <Heading size="lg">Login</Heading>
          <Input variant="outline" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} />
          <Input variant="outline" placeholder="Password" type="password" value={password} onChange={event => setPassword(event.target.value)} />
          <Input variant="outline" placeholder="Server" value={server} onChange={event => setServer(event.target.value)} />
          <Button onPress={onPress}>Primary</Button>
        </VStack>
      </Center>
  );
}

export default Main;
