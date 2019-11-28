import React, { Component } from 'react';
import {StyleSheet, Alert, Image} from "react-native";
import {Container, Content, Button, Footer, Text, View, Spinner} from "native-base";
import api from "../../services/api";

export default class SnapViewScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: `Snap from ${navigation.state.params.sender}`,
        headerLeft: null
    });

    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 8,
            picture: null
        };
        this.intervalId = null;
    }

    componentDidMount(): void {
        const snapId = this.props.navigation.getParam('snapId', null);
        if (snapId !== null) {
            api.getSnap(snapId)
                .then((response) => {
                    this.refreshCountdown();

                    //Alert.alert("taille", JSON.stringify(response.data).length.toString());
                    //const buffer = Buffer.from(response.data).toString('base64');
                    //Alert.alert("err", JSON.stringify(response.data).substr(0, 128));
                    this.setState({picture: response.data}, () => {
                        this.intervalId = setInterval(this.refreshCountdown.bind(this), 1000);
                    });
                })
                .catch((err) => {
                    Alert.alert(err.toString(), JSON.stringify(err));
                });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot): void {
        if (this.state.timeLeft <= 0) {
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
        }
    }

    componentWillUnmount(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    refreshCountdown() {
        if (this.state.timeLeft <= 0) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        } else {
            this.setState({timeLeft: this.state.timeLeft - 1});
        }
    }

    render() {
        return (
            <Container>
                    {this.state.picture && (
                        <Image style={{aspectRatio: 9 / 16, resizeMode: 'cover'}}
                               source={{uri: "data:image/jpeg;base64," + this.state.picture}}/>
                    )}
                    {(this.state.picture && this.intervalId && this.state.timeLeft <= 10) && (
                        <View style={styles.overlayUI}>
                            <Text style={styles.countdown}>{this.state.timeLeft}</Text>
                        </View>
                    )}
                    {(this.state.picture === null) && (
                        <Spinner/>
                    )}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    overlayUI: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    countdown: {
        fontSize: 130,
        color: 'rgba(255, 255, 255, 0.75)',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3
    }
});
