import * as WebBrowser from 'expo-web-browser';
import React, { PureComponent, useState, useEffect } from 'react';
import { withNavigationFocus } from 'react-navigation'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import TabBarIcon from '../components/TabBarIcon';

import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

function HomeScreen(props) {

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  var camera = null

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  takePicture = async () => {
    if (camera) {
      console.log("une bonne picture");

      const options = { quality: 0.5, base64: false };
      let photo = await camera.takePictureAsync(options);
      let formdata = new FormData()
      formdata.append("photo", "test")
      formdata.append("image", {
        name: (Math.random().toString(36).substring(15))+".jpg",
        type: "image/jpeg",
        uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
      })
      
      console.log(formdata)
      let response = fetch('http://192.168.8.103:33333/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formdata
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error(error)
        })
    }
  };
  const renderCamera = () => {
    const isActive = props.navigation.isFocused();
    console.log("is focused on HomeScreen", isActive)
    if (isActive) {
      return (
        <Camera style={{ flex: 1 }} type={type}
          ref={ref => {
            camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                // setType(
                //   type === Camera.Constants.Type.back
                //     ? Camera.Constants.Type.front
                //     : Camera.Constants.Type.back
                // );
                takePicture()
              }}>

              <Ionicons style={{ paddingBottom: 25 }} size={50} name={Platform.OS === 'ios' ? 'ios-disc' : 'md-disc'} />
            </TouchableOpacity>
          </View>
        </Camera>
      );
    } else {
      return null
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {renderCamera()}
    </View>
  );
}

HomeScreen.navigationOptions = {
  //header: null,
  title: "Prendre une photo"
};

export default withNavigationFocus(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15
  }
});
