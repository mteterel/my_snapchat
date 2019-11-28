import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions, SafeAreaViewComponent, TouchableOpacity, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Container, Button, Toast, View, Content, Header, Text } from 'native-base';
import {PermissionResponse} from "expo-permissions";

export default class SnapCaptureScreen extends Component {
  static navigationOptions = {
    header: null
  };

  camera: Camera = null;

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: false,
      cameraType: Camera.Constants.Type.back,
      enableFlash: Camera.Constants.FlashMode.off
    };
    this.switchCameraType = this.switchCameraType.bind(this);
    this.snapPicture = this.snapPicture.bind(this);
    this.toggleFlash = this.toggleFlash.bind(this);
    this.getFlashIconName = this.getFlashIconName.bind(this);
    this.askCameraPermission = this.askCameraPermission.bind(this);
  }

  async componentDidMount() {
    await this.askCameraPermission();
  }

  switchCameraType() {
    this.setState({
      cameraType: this.state.cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  }

  toggleFlash() {
    let nextFlashMode = null;
    switch (this.state.enableFlash) {
      case Camera.Constants.FlashMode.auto:
        nextFlashMode = Camera.Constants.FlashMode.on;
        break;
      case Camera.Constants.FlashMode.on:
        nextFlashMode = Camera.Constants.FlashMode.off;
        break;
      case Camera.Constants.FlashMode.off:
        nextFlashMode = Camera.Constants.FlashMode.auto;
        break;
    }

    this.setState({enableFlash: nextFlashMode});
  }

  getFlashIconName() {
    switch (this.state.enableFlash) {
      case Camera.Constants.FlashMode.auto:
        return 'flash-auto';
      case Camera.Constants.FlashMode.on:
        return 'flash-on';
      case Camera.Constants.FlashMode.off:
        return 'flash-off';
    }
  }

  snapPicture() {
    if (this.camera) {
      const options = {
        quality: 0.1,
        base64: true,
        exif: false,
      };

      this.camera.takePictureAsync(options)
          .then((photo) => {
            this.setState({picture: photo});
            this.props.navigation.navigate('Share', {
              capturedPicture: photo
            });
          })
          .catch((err) => {
            Toast.show({text: err.toString()});
          });
    }
  }

  renderCamera() {
    if (this.state.picture !== null) {
      return (
          <Camera
              style={{flex: 1}}
              ratio="16:9"
              ref={camera => this.camera = camera}
              type={this.state.cameraType}
              flashMode={this.state.enableFlash}/>
      );
    }
  }

  renderUI() {
    if (this.state.picture !== null) {
      return (
          <View style={styles.uiContainer}>
            <View style={styles.bottomControls}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                <MaterialIcons
                    size={36}
                    style={styles.iconButton}
                    name={this.state.cameraType === Camera.Constants.Type.front ? 'camera-rear' : 'camera-front'}
                    onPress={this.switchCameraType}/>
                <MaterialIcons name="camera" size={64} style={styles.iconButton} onPress={this.snapPicture}/>
                <MaterialIcons name={this.getFlashIconName()} size={36} style={styles.iconButton}
                               onPress={this.toggleFlash}/>
              </View>
            </View>
          </View>
      )
    }
  }

  renderRetryPermissionUI() {
    return (
        <View>
          <MaterialIcons name="error-outline" size={96} color="#d3d3d3"/>
          <Text>My Snapchat needs access to the camera to be able to work.</Text>
          <Button onPress={this.askCameraPermission}><Text>Grant Permission</Text></Button>
        </View>
    );
  }

  render() {
    if (this.state.hasCameraPermission) {
      return (
          <View style={{flex: 1}}>
            {this.renderCamera()}
            {this.renderUI()}
          </View>
      )
    } else {
      return (
          <View style={{flex: 1}}>
            {this.renderRetryPermissionUI()}
          </View>
      )
    }
  }

  async askCameraPermission() {
    await Permissions.askAsync(Permissions.CAMERA)
        .then(async (result) => {
          await this.setState({hasCameraPermission: result.status === 'granted'});
        })
        .catch(async (err) => {
          Toast.show({text: err.toString()});
          await this.setState({hasCameraPermission: false});
        });
  }
}

const styles = StyleSheet.create({
  uiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 0
  },
  bottomControls: {
    flex: .23,
    paddingBottom: '8%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  overlay:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  iconButton: {
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  }
});
