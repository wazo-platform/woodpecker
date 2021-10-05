import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Wazo from '@wazo/sdk/lib/simple';

export default function App() {
  const [session, setSession] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');

  const login = async () => {
    Wazo.Auth.setHost(server);
    try {
      const newSession = await Wazo.Auth.logIn(username, password);
      await Wazo.Phone.connect();
      setSession(newSession);

      localStorage.setItem('token', newSession.token);
      localStorage.setItem('refreshToken', newSession.refreshToken);
      localStorage.setItem('server', server);
    } catch (error) {
      console.error('Auts error', error);
      return;
    }
  };

  useEffect(() => {
    const validateToken = async (token: string) => {
      const refreshToken = localStorage.getItem('refreshToken');
      const existingSession = refreshToken
        ? await Wazo.Auth.validateToken(token)
        : await Wazo.Auth.validateToken(token, refreshToken);

      return existingSession;
    };

    Wazo.Auth.init('woodpecker', 10);
    const server = localStorage.getItem('server');
    const token = localStorage.getItem('token');

    if (server && token) {
      Wazo.Auth.setHost(server);
      const validToken = validateToken(token);
      if (validToken) {
        console.log('redirect !')
        // redirect to a different page
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Woody !</Text>
      <TextInput onChangeText={setUsername} placeholder='Username' />
      <TextInput onChangeText={setPassword} placeholder='Password' secureTextEntry />
      <TextInput onChangeText={setServer} placeholder='Server' />
      <Button onPress={login} title='Login' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
