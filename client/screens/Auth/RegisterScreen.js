import React, {Component} from 'react';
import {
    StyleSheet,
    Keyboard,
    View,
    AsyncStorage,
    Alert, ImageBackground
} from 'react-native';
import {
    Container,
    Header,
    Content,
    Button,
    Text,
    Form,
    Input,
    Item,
    Toast,
    Left,
    Body,
    Title,
    Right
} from 'native-base';
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
                <ImageBackground source={require('../../assets/images/staline3.jpg')} style={styles.images}>
                <Header style={styles.title}>
                    <Left/>
                    <Body>
                        <Title>Register</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content padder contentContainerStyle={styles.container}>
                    <Form style={styles.form}>
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
                                returnKeyType="next"
                                secureTextEntry={true}/>
                        </Item>
                        <Item regular>
                            <Input
                                floatingLabel
                                style={styles.inputBox}
                                onChangeText={(value) => this.setState({passwordConfirm: value})}
                                placeholder="Confirm password"
                                returnKeyType="go"
                                secureTextEntry={true}/>
                        </Item>
                        <View style={{marginTop: 16}}>
                            <Button style={styles.button} onPress={this.submitRegister}>
                                <Text>Register</Text>
                            </Button>
                            <Button transparent={true}  onPress={() => {
                                this.props.navigation.navigate('Login')
                            }}>
                                <Text style={styles.button2}>Already have an account ? Sign in</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
                </ImageBackground>
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
    images:{
        backgroundColor: '#ccc',
        flex: 1,
        resizeMode : 'cover',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    inputBox:{
        backgroundColor: '#ffffff',
    },
    form:{
        marginTop: 450,
    },
    button:{
        backgroundColor: '#e86431',
        borderWidth: 1,
    },
    button2:{
    color: '#ffffff'
    },
    title:{
        backgroundColor:  '#f54e4e',
    },
});
