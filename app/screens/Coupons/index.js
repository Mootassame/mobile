import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, PermissionsAndroid, FlatList } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, TextInput, Icon, Text, Button, Image, ListThumbCircle } from '@components';
import { useTranslation } from 'react-i18next';
import styles from './styles';

import DocumentPicker from 'react-native-document-picker';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

import Snackbar from 'react-native-snackbar';
import { BaseSetting } from '../../config/setting';

export default function Coupons({ route, navigation }) {
  const dispatch = useDispatch();

  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const files = useSelector(state => state.media.files);
  const [items, setItems] = useState(files);
  const [taken, setTaken] = useState(false);
  const [loading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);

  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('.');
    return (-1 !== index) ? url.substring(index + 1) : url;
  }

  pickFiles = async () => {
    if (items.length < 3) {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
          //There can me more options as well find above
        });
        for (const res of results) {
          //Printing the log realted to the file
          setItems(prevState => [...prevState, {
            name: res.name,
            uri: res.uri,
            type: 'application/' + getFilenameFromUrl(res.name),
            size: res.size
          }]);
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
    else {
      Snackbar.show({
        text: t('filesNumber'),
        duration: Snackbar.LENGTH_LONG,
      });
    }

  }

  removeFile = async (index) => {
    items.splice(index, 1);
    dispatch(MediaActions.onAddFiles(items));
    setRefresh(!refresh);

  }

  reset = async () => {
    setItems([]);
    dispatch(MediaActions.onAddFiles([]));
    setRefresh(!refresh);
  }

  /**
   *
   * Called when process checkout
   */
  const onCheckOut = () => {
    setLoading(true);
    dispatch(MediaActions.onAddFiles(items));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('addFile')}
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
              onPress={() => this.pickFiles()}
            >
              {t('addFile')}
            </Button>

          </View>
          <View style={styles.titleView}>
            <Text title3 semibold>
              {t('file')}
            </Text>
            {/*Showing the data of selected Multiple files*/}
            {items.map((item, key) => (
              <View key={key}>
                <ListThumbCircle
                  txtRight={
                    <Icon
                      name="times-circle"
                      size={22}
                      color={colors.primary}
                      onPress={() => this.removeFile(key)}
                    />}
                  txtContent={item.name}
                />
              </View>
            ))}

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
