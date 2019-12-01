import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  StyleSheet,
  AsyncStorage,
  Dimensions, SafeAreaViewComponent, TouchableOpacity, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Container, Button, Toast, View, Content, Header, Text, Spinner } from 'native-base';
import {PermissionResponse} from "expo-permissions";

export default class SnapCaptureScreen extends Component {
  static navigationOptions = {
    header: null
  };

  camera: Camera = null;

  constructor(props) {
    super(props);
    this.state = {
      isAskingPermission: true,
      hasCameraPermission: false,
      cameraType: Camera.Constants.Type.back,
      enableFlash: Camera.Constants.FlashMode.off
    };
    this.switchCameraType = this.switchCameraType.bind(this);
    this.snapPicture = this.snapPicture.bind(this);
    this.toggleFlash = this.toggleFlash.bind(this);
    this.getFlashIconName = this.getFlashIconName.bind(this);
    this.askCameraPermission = this.askCameraPermission.bind(this);
    this.performLogout = this.performLogout.bind(this);
  }

  async componentDidMount() {
    await this.askCameraPermission();
  }

  performLogout() {
    AsyncStorage.removeItem("token")
        .then(() => {
          this.props.navigation.navigate("Landing");
        });
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
        quality: 0.7,
        base64: true,
        exif: false,
        skipProcessing: true
      };

      this.setState({ isCapturing: true });

      this.camera.takePictureAsync(options)
          .then((photo) => {
            this.setState({picture: photo, isCapturing: false});
            this.props.navigation.navigate('Share', {
              capturedPicture: photo
            });
          })
          .catch((err) => {
            this.setState({isCapturing: false});
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
              autoFocus={Camera.Constants.AutoFocus.off}
              ref={camera => this.camera = camera}
              type={this.state.cameraType}
              flashMode={this.state.enableFlash}/>
      );
    }
  }

  renderUI() {
    if (!this.state.isCapturing && this.state.picture !== null) {
      return (
          <View style={styles.uiContainer}>
            <View style={styles.topControls}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                <MaterialIcons name="inbox" size={24} style={styles.iconButton}
                               onPress={() => {
                                 this.props.navigation.navigate('Inbox')
                               }}/>
                <MaterialIcons name="exit-to-app" size={24} style={styles.iconButton} onPress={this.performLogout}/>
              </View>
            </View>
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
    return (
        <Container>
            {this.state.hasCameraPermission && (
                <View style={{flex: 1}}>
                  {this.renderCamera()}
                  {this.renderUI()}
                </View>
            )}
            {(!this.state.isAskingPermission && !this.state.hasCameraPermission) && (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  {this.renderRetryPermissionUI()}
                </View>
            )}
            {(this.state.isAskingPermission && !this.state.hasCameraPermission) && (
                <Spinner/>
            )}
        </Container>
    )
  }

  async askCameraPermission() {
    this.setState({isAskingPermission: true});
    await Permissions.askAsync(Permissions.CAMERA)
        .then(async (result) => {
          this.setState({isAskingPermission: false, hasCameraPermission: result.status === 'granted'});
        })
        .catch(async (err) => {
          Toast.show({text: err.toString()});
          this.setState({isAskingPermission: false, hasCameraPermission: false});
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
  topControls: {
    flex: 1,
    paddingTop: '14%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
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
