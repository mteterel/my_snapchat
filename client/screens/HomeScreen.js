import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
export default function HomeScreen() {
  return (
      <View style={styles.homescreen}>
        <Text style={styles.logoText}>OsefChat</Text>
          <Button
              // onPress = {handlePress}
              title = "Login"
              color = "#9230af"
          />
          <Button
              // onPress = {handlePress}
              title = "Register"
              color = "#3e43e2"
          />
      </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  homescreen:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#1d0a23',
  },
  logoText:{
    color: '#ffffff',
    fontSize: 31
  }
});
