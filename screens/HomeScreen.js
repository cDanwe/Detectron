import * as WebBrowser from 'expo-web-browser';
import React, { PureComponent, useState, useEffect } from 'react';
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

export default function HomeScreen() {

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

        const options = { quality: 0.5, base64: true };
        let photo = await camera.takePictureAsync(options);
      }

    };
    
    return (
      <View style={{ flex: 1 }}>
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

              <Ionicons style={{paddingBottom: 25}} size={50} name={Platform.OS === 'ios' ? 'ios-disc' : 'md-disc'} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
}

HomeScreen.navigationOptions = {
  header: null,
  //title: "Capture scene"
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15
  }
});
