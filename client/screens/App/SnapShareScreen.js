import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  StyleSheet,
    Image,
    Alert
} from 'react-native';
import { Container, Header, Content, Button, List, ListItem, Text, Left, Icon, Input, Body, Right, CheckBox, Item, Form, Toast, Spinner, Picker, Separator } from "native-base";
import api from "../../services/api";

export default class SnapShareScreen extends Component {
    static navigationOptions = {
        title: 'Share Snap'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingContacts: true,
            contacts: [],
            selectedContact: null,
            selectedSnapDuration: null
        };

        this.onContactSelected = this.onContactSelected.bind(this);
    }

    componentDidMount() {
        api.getAllUsers()
            .then((response) => {
                const json = response.data;
                if (json.data && typeof (json.data) === 'object')
                    this.setState({loadingContacts: false, contacts: json.data});
                else
                    Toast.show({type: 'danger', text: json.data.toString()});
            })
            .catch((err) => {
                Alert.alert('Oh snap !', err.toString());
            });
    }

    async onContactSelected(email) {
        await this.setState({selectedContact: email});

        Toast.show({
            text: `Sending Snap to ${this.state.selectedContact}...`
        });

        const photo = this.props.navigation.getParam('capturedPicture', null);

        if (!photo)
            throw new Error("capturedPicture is null");

        api.sendSnap(email, this.state.selectedSnapDuration, photo.base64)
            .then((response) => {
                if (response.data.data === 'Snap Created')
                    Toast.show({type: 'success', text: `Successfully sent a Snap to ${this.state.selectedContact}`});
                else
                    Toast.show({type: 'danger', text: `Failed to send Snap: ${response.data.data}`});
            })
            .catch((err) => {
                Alert.alert("Oh snap !", err.toString());
            })
            .then(() => {
                this.props.navigation.navigate('Home');
            });
    }

    render() {
        return (
            <Container>
                <Content>
                    {this.state.loadingContacts && <Spinner/>}
                    {!this.state.loadingContacts && (
                        <>
                            <Image style={styles.imagePreview} source={{uri: "data:image/jpeg;base64," + this.props.navigation.state.params.capturedPicture.base64}} />
                            <List>
                                <Separator bordered>
                                    <Text>Snap Settings</Text>
                                </Separator>
                            </List>
                            <Form>
                                <Item picker>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        style={{ width: undefined }}
                                        placeholder="Duration"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selectedSnapDuration}
                                        onValueChange={(value) => this.setState({selectedSnapDuration: value})}
                                    >
                                        <Picker.Item label="5 seconds" value={5} />
                                        <Picker.Item label="10 seconds" value={10} />
                                        <Picker.Item label="30 seconds" value={30} />
                                        <Picker.Item label="60 seconds" value={60} />
                                    </Picker>
                                </Item>
                                <Item regular>
                                    <Input placeholder="Text to include in the picture" />
                                </Item>
                            </Form>
                            <List>
                                <Separator bordered>
                                    <Text>Selet a contact ({this.state.contacts.length})</Text>
                                </Separator>
                                {this.state.contacts.map((elem, index) => {
                                    return (
                                        <ListItem button={true} key={index} index={index} onPress={() => {
                                            this.onContactSelected(elem.email)
                                        }}>
                                            <Text>{elem.email}</Text>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </>
                    )}
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    imagePreview: {
        width: 'auto',
        height: 300,
        resizeMode: 'cover'
    }
});
