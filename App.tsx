import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Wazo from '@wazo/sdk/lib/simple';

Wazo.Auth.init('woodpecker');

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
    } catch (error) {
      console.error('Auth error', error);
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text>Woody !</Text>
      <TextInput onChangeText={setUsername} placeholder="Username" />
      <TextInput onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <TextInput onChangeText={setServer} placeholder="Server" />
      <Button onPress={login} title="Login" />
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
