import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    Dimensions,
    ImageBackground
} from 'react-native';
import { Container, Content, Button, Image, Text, View, Toast, Spinner } from 'native-base';
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
                            {/*<Image source={require('../assets/images/logo.png')}/>*/}
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
        fontSize: 56,
        paddingBottom: 50,
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        flex: 1,
        width: 40,
        flexWrap: 'wrap',
        paddingTop: 96,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        marginRight: 280,
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
        resizeMode : 'cover',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    }
});
