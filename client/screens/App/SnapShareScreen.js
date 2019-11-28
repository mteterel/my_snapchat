import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  StyleSheet,
    Alert
} from 'react-native';
import { Container, Header, Content, Button, List, ListItem, Text, Left, Body, Right, CheckBox, Toast, Spinner } from "native-base";
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
    };

    this.onContactSelected = this.onContactSelected.bind(this);
    /*setTimeout(() => {
      this.setState({ loadingContacts: false });
    }, 600);*/
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
    await this.setState({ selectedContact: email });

    Toast.show({
      text: `Sending Snap to ${this.state.selectedContact}...`
    });

    setTimeout(() => {
      Toast.show({type: 'success', text: `Successfully sent a Snap to ${this.state.selectedContact}`});
      this.props.navigation.navigate('Home');
    }, 1400);
  }

  render() {
    return (
        <Container>
          <Content>
            {this.state.loadingContacts && <Spinner/>}
            {!this.state.loadingContacts &&
            <List>
              {this.state.contacts.map((elem, index) => {
                return (
                    <ListItem button={true} key={index} index={index} onPress={() => { this.onContactSelected(elem.email) }}>
                      <Text>{elem.email}</Text>
                    </ListItem>
                );
              })}
            </List>
            }
          </Content>
        </Container>
    )
  }
}

const styles = StyleSheet.create({

});
