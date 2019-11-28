import React, { Component } from 'react';
import {StyleSheet, ScrollView, Alert} from "react-native";
import {Container, List, ListItem, Button, Left, Body, Text, Right, Toast} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import api from "../../services/api";

export default class InboxScreen extends Component {
    static navigationOptions = {
        title: "Inbox"
    };

    constructor(props) {
        super(props);
        this.state = {
            receivedSnaps: [],
            lastSeenSnap: null
        };
        this.removeLastSeenSnap = this.removeLastSeenSnap.bind(this);
    }

    componentDidMount() {
        api.getAllSnaps()
            .then((response) => {
                const json = response.data;
                this.setState({receivedSnaps: json.data});
            })
            .catch((err) => {

            });
    }

    removeLastSeenSnap() {
        if (this.state.lastSeenSnap) {
            api.removeSnap(this.state.lastSeenSnap);
            this.setState({
                receivedSnaps: this.state.receivedSnaps.filter((val) => {
                    return val.snap_id !== this.state.lastSeenSnap
                }),
                lastSeenSnap: null
            });
        }
    }

    render() {
        return (
            <Container>
                <ScrollView>
                    <List>
                        {this.state.receivedSnaps.map((element) => {
                            return (
                                <ListItem key={element.snap_id} thumbnail>
                                    <Left>
                                        <MaterialIcons size={48} name="photo" color="pink"/>
                                    </Left>
                                    <Body>
                                        <Text>{element.from}</Text>
                                    </Body>
                                    <Right>
                                        <Button primary transparent onPress={() => {
                                            this.setState({lastSeenSnap: element.snap_id});
                                            this.props.navigation.navigate("SnapView", {
                                                snapId: element.snap_id,
                                                sender: element.from,
                                                onGoBack: () => {
                                                    this.removeLastSeenSnap();
                                                }
                                            })
                                        }}>
                                            <Text>View</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});
