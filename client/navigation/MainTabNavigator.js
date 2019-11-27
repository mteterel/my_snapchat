import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import {create} from "react-native/jest/renderer";
//import DeviceInfo from 'react-native-device-info';
import SafeAreaView from "react-native";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: { headerMode: 'screen' },
});

/*if (Platform.OS === 'android' && DeviceInfo.hasNotch()) {
    SafeAreaView.setStatusBarHeight();
}*/

const AuthStack = createSwitchNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
}, config);

const AppStack = createBottomTabNavigator({
    Home: HomeScreen,
    Settings: SettingsScreen
});

const navigator = createSwitchNavigator({
    Auth: AuthStack,
    AppStack: AppStack
});

export default navigator;
