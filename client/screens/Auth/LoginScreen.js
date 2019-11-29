import React, {Component} from 'react';
import {
    StyleSheet,
    Keyboard,
    View,
    AsyncStorage,
    Alert
} from 'react-native';
import {Container, Header, Content, Button, Text, Form, Input, Item, Title, Left, Body, Right, Toast} from 'native-base';
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

    submitLogin() {
        Keyboard.dismiss();
        api.login(this.state.email, this.state.password)
            .then(async (result) => {
                const json = result.data;

                if (json.data.token) {
                    await AsyncStorage.setItem("token", json.data.token);
                    api.setApiToken(json.data.token);
                    this.props.navigation.navigate('AppStack');
                } else {
                    Toast.show({text: json.data, type: 'danger', buttonText: 'Dismiss'});
                }
            })
            .catch((err) => {
                Alert.alert("Oh snap !", err.toString());
            });
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                        <Title>Login</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content padder contentContainerStyle={styles.container}>
                    <Form>
                        <Item regular>
                            <Input
                                floatingLabel
                                style={styles.inputBox}
                                onChangeText={(value) => this.setState({email: value})}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                returnKeyType="next"/>
                        </Item>
                        <Item regular>
                            <Input
                                floatingLabel
                                style={styles.inputBox}
                                onChangeText={(value) => this.setState({password: value})}
                                placeholder="Password"
                                returnKeyType="go"
                                secureTextEntry={true}/>
                        </Item>
                        <View>
                            <Button onPress={this.submitLogin}>
                                <Text>Login</Text>
                            </Button>
                            <Button transparent={true} style={styles.button} onPress={() => {
                                this.props.navigation.navigate('Register')
                            }}>
                                <Text>Don't have an account yet ? Sign up</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
