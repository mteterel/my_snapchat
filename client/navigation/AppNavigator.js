import React from 'react';
import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import SnapCaptureScreen from "../screens/App/SnapCaptureScreen";
import SnapShareScreen from "../screens/App/SnapShareScreen";
import LandingScreen from "../screens/LandingScreen";

const config = {

};

const AuthStack = createSwitchNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
}, config);

const AppStack = createStackNavigator({
    Home: {
        screen: SnapCaptureScreen,
        navigationOptions: { header: null, headerStyle: 'none' }
    },
    Share: {
        screen: SnapShareScreen
    }
}, config);

export default createAppContainer(
  createSwitchNavigator({
      Landing: LandingScreen,
      Auth: AuthStack,
      AppStack: AppStack
  }, { header: null })
);
