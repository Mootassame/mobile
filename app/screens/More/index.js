import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, PermissionsAndroid, FlatList } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, TextInput, Icon, Text, Button, Image } from '@components';
import { useTranslation } from 'react-i18next';
import styles from './styles';

import * as ImagePicker from 'react-native-image-picker';

import VideoPlayer from 'react-native-video-player';
import * as MediaLibrary from '@pontusab/react-native-media-library';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

import Snackbar from 'react-native-snackbar';

import SyanImagePicker from 'react-native-syan-image-picker';


import { Images } from "@config";

export default function More({ route, navigation }) {

  const dispatch = useDispatch();
  const video = useSelector(state => state.media.video);

  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [items, setItems] = useState(video);
  const [taken, setTaken] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cameraPermissions, setCameraPermissions] = useState(false);
  const [stockagePermissions, setStockagePermissions] = useState(false);

  requestCameraPermission = async () => {
    try {
      const grantedCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      console.log('granted', grantedCamera);
      if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPermissions(true)
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestStockagePermission = async () => {
    try {
      const grantedStockage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Stockage Permission",
          message: "App needs access to your stockage ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      console.log('granted', grantedStockage);
      if (grantedStockage === PermissionsAndroid.RESULTS.GRANTED) {
        setStockagePermissions(true)
      } else {
        console.log("Stockage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }

  };
  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('/');
    return (-1 !== index) ? url.substring(index + 1) : url;
  }

  handleOpenVideoPicker = () => {
    SyanImagePicker.openVideoPicker({ allowPickingMultipleVideo: true }, (err, res) => {
      console.log(err, res);
      if (!err) {
        setTaken(true);
        setItems(
          {
            name: res[0].fileName,
            uri: res[0].uri,
            type: 'video/mp4',
            size: res[0].size
          }
        );
      }
    })
  };


  launchCamera = async () => {
    await this.requestStockagePermission();
    await this.requestCameraPermission();
    let options = {
      mediaType: 'video',
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));

        setItems({
          name: response.fileName,
          uri: response.uri,
          type: 'video/mp4',
          size: response.size
        });
        const asset = MediaLibrary.createAssetAsync(response.uri);
        asset.then(res => {
          Snackbar.show({
            text: t('savedAt') + res.uri,
            duration: Snackbar.LENGTH_LONG,
          });
        })
        setTaken(true);
      }
    });
  }

  removeVideo = async () => {
    setItems();
    dispatch(MediaActions.onAddVideo(null));
    setRefresh(!refresh);
  }

  reset = async () => {
    setItems();
    dispatch(MediaActions.onAddVideo(null));
    setRefresh(!refresh);
  }

  /**
   *
   * Called when process checkout
   */
  const onCheckOut = () => {
    dispatch(MediaActions.onAddVideo(items));
    setLoading(true);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('addVideo')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return (
            <Icon
              name="redo-alt"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => this.reset()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>

          <View>
            <Button
              full
              style={styles.button}
              onPress={() => this.handleOpenVideoPicker()}
            >
              {t('openGallery')}
            </Button>
            <Button
              full
              style={styles.button}
              onPress={() => this.launchCamera()}
            >
              {t('openCamera')}
            </Button>
          </View>

          <View style={styles.titleView}>
            <Text title3 semibold>
              {t('video')}
            </Text>

          </View>
          {items ?
            <View style={{ flexDirection: 'column' }}>
              <Icon
                name="times-circle"
                size={22}
                color={colors.primary}
                onPress={() => this.removeVideo()}
                style={{ alignSelf: 'flex-start' }}
              />
              <VideoPlayer
                video={{ uri: items.uri }}
                thumbnail={{ uri: items.uri }}
                endThumbnail={{ uri: items.uri }}
              />
            </View>
            :
            null
          }

        </ScrollView>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onCheckOut();
            }}>
            {t('add')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
