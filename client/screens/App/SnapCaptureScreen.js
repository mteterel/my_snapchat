import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Dimensions, SafeAreaViewComponent, TouchableOpacity, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default class SnapCaptureScreen extends Component {
  camera = null;

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
  }

  async componentDidMount() {
    const {hasCameraPermission} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: hasCameraPermission === 'granted'});
  }

  switchCameraType() {
    this.setState({
      cameraType: this.state.cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  }

  toggleFlash() {
    this.setState({
      enableFlash: this.state.enableFlash === Camera.Constants.FlashMode.on
          ? Camera.Constants.FlashMode.off
          : Camera.Constants.FlashMode.on
    });
  }

  async snapPicture() {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();
      this.camera.pausePreview();
      this.setState({picture: photo});
    }
  }

  renderCamera() {
    if (this.state.picture !== null) {
      return (
          <Camera
              style={styles.preview}
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
                <MaterialIcons name="camera" size={36} style={styles.iconButton} onPress={this.snapPicture}/>
              </View>
            </View>
          </View>
      )
    }
  }

  render() {
    return (
        <View style={{flex: 1}}>
          {this.renderCamera()}
          {this.renderUI()}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 1
  },
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
    justifyContent: 'center',
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
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3
  }
});
