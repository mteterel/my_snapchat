import React, { Component } from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, TextInput} from 'react-native';

export default class RegisterScreen extends Component
{
  static navigationOptions = {
    title: 'Register',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordConfirm: ""
    };
    this.submitRegister = this.submitRegister.bind(this);
  }

  submitRegister() {

  }

  render() {
    return (
        <SafeAreaView style={styles.container}>
          <TextInput
              style={styles.inputBox}
              onChangeText={(value) => this.setState({email: value})}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"/>

          <TextInput
              style={styles.inputBox}
              onChangeText={(value) => this.setState({password: value})}
              placeholder="Password"
              returnKeyType="next"
              secureTextEntry={true}/>

          <TextInput
              style={styles.inputBox}
              onChangeText={(value) => this.setState({passwordConfirm: value})}
              placeholder="Confirm password"
              returnKeyType="go"
              secureTextEntry={true}/>

          <Button style={styles.button} title="Register" onPress={this.submitRegister}/>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 160
  },
  inputBox: {},
  button: {}
});
