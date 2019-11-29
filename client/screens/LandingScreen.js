import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    Dimensions,
    ImageBackground
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
                <ImageBackground source={require('../assets/images/staline.jpg')} style={styles.images}>
                    {this.state.isAutoLogin && (
                        <View>
                            <Spinner/>
                            <Text style={{color: 'white', textAlign: 'center'}}>Logging in...</Text>
                        </View>
                    )}
                    {!this.state.isAutoLogin && (
                        <View style={styles.homescreen}>
                            <Text style={styles.logoText}>Снапчате</Text>
                            <Button style={styles.button1}
                                    onPress={() => {
                                        this.props.navigation.navigate('Login')
                                    }}
                            ><Text>Login</Text></Button>
                            <Button style={styles.button2}
                                    onPress={() => {
                                        this.props.navigation.navigate('Register')
                                    }}
                            ><Text>Register</Text></Button>
                        </View>)}
                </ImageBackground>
            </Container>
        );
    }
}

var width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    homescreen:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: '#441444',
    },
    logoText:{
        color: '#ffffff',
        fontSize: 31,
        paddingBottom: 50,
    },
    button1:{
        backgroundColor: "#e86431",
        width: width,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginTop: 20,
        position: 'absolute',
        bottom:0,
    },
    button2:{
        backgroundColor: "#77331e",
        width: width,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        // marginTop: 20,
        position: 'absolute',
        bottom:50,
    },
    images:{
        backgroundColor: '#ccc',
        flex: 1,
        position: 'absolute',
        resizeMode : 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    }
});
