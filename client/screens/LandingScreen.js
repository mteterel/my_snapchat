import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
} from 'react-native';
import { Container, Content, Button, Text, View, Toast, Spinner } from 'native-base';
import api from "../services/api";

export default class LandignScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isAutoLogin: false
        }
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            this.setState({isAutoLogin: true});
            api.loginWithToken(token)
                .then(response => {
                    const json = response.data;
                    if (typeof (response.data) === 'object') {
                        AsyncStorage.setItem("token", json.data.token);
                        api.setApiToken(json.data.token);
                        this.props.navigation.navigate('AppStack');
                    } else {
                        this.setState({isAutoLogin: false});
                        AsyncStorage.removeItem("token");
                        Toast.show({type: 'danger', text: response.data});
                    }
                })
                .catch(err => {
                    this.setState({isAutoLogin: false});
                    AsyncStorage.removeItem("token");
                });
        }
    }

    render() {
        return (
            <Container style={styles.homescreen}>
                {this.state.isAutoLogin && (
                    <View>
                        <Spinner/>
                        <Text style={{color: 'white', textAlign: 'center'}}>Logging in...</Text>
                    </View>
                )}
                {!this.state.isAutoLogin && (
                    <View>
                        <Text style={styles.logoText}>OsefChat</Text>
                        <Button
                            onPress={() => {
                                this.props.navigation.navigate('Login')
                            }}
                            color="#9230af"><Text>Login</Text></Button>
                        <Button
                            onPress={() => {
                                this.props.navigation.navigate('Register')
                            }}
                            color="#3e43e2"><Text>Register</Text></Button>
                    </View>)}
            </Container>
        );
    }
}

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
