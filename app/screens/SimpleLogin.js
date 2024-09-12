// SimpleLogin.js
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { handleLogin, handleMenu } from '../libs/authService'; // Importa ambas funciones


const SimpleLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 

  const router = useRouter();

  const onLoginPress = async () => {
    try {
      await handleLogin(username, password);
      if (username) {
      router.push({
                  pathname:'/screens/menu',
                  params:{username},
                   
                })
              }
    } catch (error) {
        console.error('Error logging in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CODE</Text>
     
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log In" onPress={onLoginPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'bgred',
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default SimpleLogin;