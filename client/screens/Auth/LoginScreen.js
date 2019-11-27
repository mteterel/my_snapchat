import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Text,
    Keyboard,
    Button,
    View,
    AsyncStorage,
    Alert
} from 'react-native';
import api from '../../services/api';

export default class LoginScreen extends Component {
    static navigationOptions = {
        title: 'Login',
    };

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.submitLogin = this.submitLogin.bind(this);
    }

    async submitLogin() {
        api.login(this.state.email, this.state.password)
            .then(async (result) => {
                const json = result.data;

                if (json.data.token) {
                    await AsyncStorage.setItem("token", json.data.token);
                    api.setApiToken(json.data.token);
                    this.props.navigation.navigate('AppStack');
                } else {
                    Alert.alert("Oh snap !", json.data);
                }
            })
            .catch((err) => {
                Alert.alert("Oh snap !", err.toString());
            });
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
                    returnKeyType="go"
                    secureTextEntry={true}/>

                <Button style={styles.button} title="Login" onPress={this.submitLogin}/>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 300
    },
    inputBox: {},
    button: {}
});
