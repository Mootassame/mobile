import React, { useState, Component } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, PermissionsAndroid } from 'react-native';
import { Slider } from '@react-native-community/slider'

import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, ListThumbCircle } from '@components';
import { useTranslation } from 'react-i18next';

import DocumentPicker from 'react-native-document-picker';

import Snackbar from 'react-native-snackbar';
import { styles } from './styles';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

export default function OurService({ route, navigation }) {

  const dispatch = useDispatch();

  const audio = useSelector(state => state.media.audio);
  const [item, setItem] = useState(audio);
  const [taken, setTaken] = useState(false);

  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [loading, setLoading] = useState(false);

  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('.');
    return (-1 !== index) ? url.substring(index + 1) : url;
  }

  pickFiles = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: ['audio/*'],
        //There can me more options as well find above
      });
      for (const res of results) {
        //Printing the log realted to the file
        setItem({
          name: res.name,
          uri: res.uri,
          type: 'audio/mpeg',
          size: res.size
        });
      }
      //Setting the state to show multiple file attributes
      setTaken(true);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }

  }

  reset = async () => {
    setItem();
    dispatch(MediaActions.onAddAudio(null));
    setRefresh(!refresh);
  }

  /**
   * 
   * Called when process checkout
   */

  const onCheckOut = async () => {
    dispatch(MediaActions.onAddAudio(item));
    setLoading(true);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('addAudio')}
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
            <Button
              full
              onPress={() => this.pickFiles()}>
              {t('addAudio')}
            </Button>

          </View>
          <View style={styles.titleView}>
            <Text title3 semibold>
              {t('audio')}
            </Text>
            {item ?
              <View >
                <ListThumbCircle
                  txtRight={
                    <Icon
                      name="times-circle"
                      size={22}
                      color={colors.primary}
                      onPress={() => this.reset()}
                    />}
                  txtContent={item.name}
                />
              </View>
              :
              null
            }

          </View>
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
