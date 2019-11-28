import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Container, Content, Button, Text, View } from 'native-base';

export default function LandingScreen(props) {
  return (
      <Container style={styles.homescreen}>
        <Text style={styles.logoText}>OsefChat</Text>
        <View>
          <Button
              onPress={() => {props.navigation.navigate('Login')}}
              color="#9230af"><Text>Login</Text></Button>
          <Button
              onPress={() => {props.navigation.navigate('Register')}}
              color="#3e43e2"><Text>Register</Text></Button>
        </View>
      </Container>
  );
}

LandingScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  homescreen:{
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#1d0a23',
  },
  logoText:{
    color: '#ffffff',
    fontSize: 31
  }
});
