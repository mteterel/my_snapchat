import React, {Component} from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import { Container, Header, Content, Button, Text, Form, Input, Item, Toast } from 'native-base';
import api from '../../services/api';

export default class RegisterScreen extends Component {
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
        this.validatePasswords = this.validatePasswords.bind(this);
    }

    validatePasswords() {
        return this.state.password === this.state.passwordConfirm;
    }

    performLogin(email, password) {
        api.login(email, password)
            .then(async (result) => {
                const json = result.data;

                if (json.data.token) {
                    await AsyncStorage.setItem("token", json.data.token);
                    api.setApiToken(json.data.token);
                    this.props.navigation.navigate('AppStack');
                } else {
                    Toast.show({text: json.data, type: 'danger', buttonText: 'Dismiss'});
                    this.props.navigation.navigate('Login');
                }
            })
            .catch((err) => {
                Alert.alert("Oh snap !", err.toString());
                this.props.navigation.navigate('Login');
            });
    }

    submitRegister() {
        const {email, password} = this.state;
        Keyboard.dismiss();

        api.register(email, password)
            .then(async (result) => {
                const json = result.data;

                if (typeof json.data === 'string')
                    Toast.show({text: json.data, type: 'danger', buttonText: 'Dismiss'});
                else {
                    Toast.show({text: 'Registered successfully, logging in...', type: 'success'});
                    this.performLogin(email, password);
                }
            })
            .catch((err) => {
                Alert.alert("Oh snap !", err.toString());
            });
    }

    render() {
        return (
            <Container>
                <Header/>
                <Content>
                    <Form>
                        <Item>
                            <Input
                                floatingLabel
                                style={styles.inputBox}
                                onChangeText={(value) => this.setState({email: value})}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                returnKeyType="next"/>
                        </Item>
                        <Item>
                            <Input
                                floatingLabel
                                style={styles.inputBox}
                                onChangeText={(value) => this.setState({password: value})}
                                placeholder="Password"
                                returnKeyType="next"
                                secureTextEntry={true}
                                success={this.state.passwordConfirm && this.validatePasswords()}
                                error={this.state.passwordConfirm && !this.validatePasswords()}/>
                        </Item>
                        <Item>
                            <Input
                                floatingLabel
                                style={styles.inputBox}
                                onChangeText={(value) => this.setState({passwordConfirm: value})}
                                placeholder="Confirm password"
                                returnKeyType="go"
                                secureTextEntry={true}
                                success={this.state.password && this.validatePasswords()}
                                error={this.state.password && !this.validatePasswords()}/>
                        </Item>
                        <Button style={styles.button} onPress={this.submitRegister}>
                            <Text>Register</Text>
                        </Button>
                        <Button transparent={true} style={styles.button} onPress={() => {
                            this.props.navigation.navigate('Login')
                        }}>
                            <Text>Already have an account ? Sign in</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 160
  },
  inputBox: {},
  button: {}
});
