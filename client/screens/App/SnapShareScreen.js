import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Container, Header, Content, Button, List, ListItem, Text, Left, Body, Right, CheckBox } from "native-base";

export default class SnapShareScreen extends Component {
  static navigationOptions = {
    title: 'Share Snap'
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [
        'Rachel Greene',
        'Monica Geller',
        'Phoebe Buffay',
        'Joey Tribbiani',
        'Chandler Bing',
        'Ross Geller'
      ]
    };
  }

  render() {
    const elements = [];

    return (
        <Container>
          <Header>
            <Left>
              <Text>0 selected</Text>
            </Left>
            <Right>
              <Button hasText transparent>
                <Text>Send</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            { /*this.state.contacts.map((elem, index) => {
              return <Button transparent key={index}><Text>Name</Text></Button>;
            })*/ }
          </Content>
        </Container>
    )
  }
}

const styles = StyleSheet.create({

});
