import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, PermissionsAndroid, FlatList } from 'react-native';
import { BaseStyle, useTheme, BaseSetting } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, Image } from '@components';
import { useTranslation } from 'react-i18next';
import styles from './styles';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

import Snackbar from 'react-native-snackbar';
import SyanImagePicker from 'react-native-syan-image-picker';

export default function CheckOut({ route, navigation }) {
  const dispatch = useDispatch();

  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const images = useSelector(state => state.media.images);
  const [items, setItems] = useState(images);
  const [loading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [cameraPermissions, setCameraPermissions] = useState(false);
  const [stockagePermissions, setStockagePermissions] = useState(false);
  const token = useSelector(state => state.media.token);
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
      if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPermissions(true)
      } else {
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
      if (grantedStockage === PermissionsAndroid.RESULTS.GRANTED) {
        setStockagePermissions(true)
      } else {
      }
    } catch (err) {
      console.warn(err);
    }

  };

  removePhoto = async (index) => {
    items.splice(index, 1);
    dispatch(MediaActions.onAddImages(items));
    setRefresh(!refresh);

  }

  handleLaunchCamera = async () => {
    if (items.length < 10) {
      await this.requestStockagePermission();
      await this.requestCameraPermission();
      SyanImagePicker.openCamera({ showCropFrame: false }, (err, photos) => {
        if (!err) {
          setItems(prevState => [...prevState, {
            name: this.getFilenameFromUrl(photos[0].uri),
            uri: photos[0].uri,
            type: 'image/' + photos[0].type,
            size: photos[0].size
          }]);
          Snackbar.show({
            text: t('savedAt') + photos[0].uri,
            duration: Snackbar.LENGTH_LONG,
          });

        }
      })
    }
    else {
      Snackbar.show({
        text: t('imagesNumber'),
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };
  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('/');
    return (-1 !== index) ? url.substring(index + 1) : url;
  }

  launchLibrary = async () => {
    if (items.length < 10) {
      SyanImagePicker.asyncShowImagePicker({ imageCount: 10 - items.length, isGif: true, })
        .then(photos => {
          const arr = photos.map(v => {
            setItems(prevState => [...prevState, {
              name: this.getFilenameFromUrl(v.uri),
              uri: v.uri,
              type: 'image/' + v.type,
              size: v.size
            }]);
            return v
          });

        })
        .catch(err => {

        })
    }
    else {
      Snackbar.show({
        text: t('imagesNumber'),
        duration: Snackbar.LENGTH_LONG,
      });
    }

  }

  reset = async () => {
    setItems([]);
    dispatch(MediaActions.onAddImages([]));
    setRefresh(!refresh);
  }
  /**
   *
   * Called when process checkout
   */


  const onCheckOut = async () => {

    dispatch(MediaActions.onAddImages(items));
    setLoading(true);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('addImage')}
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
              onPress={() => this.launchLibrary()}
            >
              {t('openGallery')}
            </Button>
            <Button
              full
              style={styles.button}
              onPress={() => this.handleLaunchCamera()}
            >
              {t('openCamera')}
            </Button>
          </View>
          <View style={styles.titleView}>
            <Text title3 semibold>
              {t('image')}
            </Text>

          </View>
          {items.length !== 0 ?

            <FlatList
              columnWrapperStyle={{ alignSelf: 'center' }}
              numColumns={2}
              data={items}
              extraData={refresh}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <View style={{ flex: 1 }}>

                  <Icon
                    name="times-circle"
                    size={20}
                    color={colors.primary}
                    onPress={() => this.removePhoto(index)}
                    style={{ alignSelf: 'flex-start' }}
                  />
                  <Image source={{ uri: item.uri }} style={styles.blockImage} />
                </View>

              )}
            />
            :
            null
          }

        </ScrollView>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onCheckOut()
            }}>
            {t('add')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
