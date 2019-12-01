import React, {Component} from 'react';
import {
    StyleSheet,
    Keyboard,
    View,
    AsyncStorage,
    Alert, ImageBackground, Dimensions
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
                <ImageBackground source={require('../../assets/images/staline2.jpg')} style={styles.images}>
                    <Header style={styles.title}>
                        <Left/>
                        <Body >
                            <Title >Login</Title>
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
                                    returnKeyType="go"
                                    secureTextEntry={true}/>
                            </Item>
                            <View>
                                <Button onPress={this.submitLogin} style={styles.button}>
                                    <Text style={styles.text}>Login</Text>
                                </Button>
                                <Button transparent={true} style={styles.button3} onPress={() => {
                                    this.props.navigation.navigate('Register')
                                }}>
                                    <Text style={styles.button2}>Don't have an account yet ? Sign up</Text>
                                </Button>
                            </View>
                        </Form>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
};
var width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f54e4e',
    },
    button:{
        backgroundColor: '#e86431',
        borderWidth: 1,

    },
    button2:{
        color: '#ffffff'
    },
    text:{
        color: '#ffffff'
    },
    inputBox:{
        backgroundColor: '#ffffff',
    },
    title:{
        backgroundColor:  '#f54e4e',
    },
    images:{
        backgroundColor: '#ccc',
        flex: 1,
        resizeMode : 'cover',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    form:{
        marginTop: 350,
    }
});
