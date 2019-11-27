import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Body } from "native-base";

export default class SnapShareScreen extends Component {
  static navigationOptions = {
    title: 'Share Snap'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Container>
          <Content>
            <List>
              <ListItem avatar>
                <Left>
                  <Text>@</Text>
                </Left>
                <Body>
                  <Text>Simon Mignolet</Text>
                </Body>
              </ListItem>
              <ListItem avatar>
                <Left>
                  <Text>@</Text>
                </Left>
                <Body>
                  <Text>Simon Mignolet</Text>
                </Body>
              </ListItem>
              <ListItem avatar>
                <Left>
                  <Text>@</Text>
                </Left>
                <Body>
                  <Text>Simon Mignolet</Text>
                </Body>
              </ListItem>
            </List>
          </Content>
        </Container>
    )
  }
}

const styles = StyleSheet.create({

});
