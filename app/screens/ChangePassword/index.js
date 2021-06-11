import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BaseStyle, useTheme, BaseSetting } from '@config';
import { useTranslation } from 'react-i18next';
import { Header, SafeAreaView, Icon, Text, Button, TextInput } from '@components';
import styles from './styles';
import Axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import Snackbar from 'react-native-snackbar';

import { useSelector, useDispatch } from "react-redux";

export default function ChangePassword({ navigation }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const currentUser = useSelector((state) => state.media.user_id);
  const token = useSelector((state) => state.media.token);
  const SERVER_URL = '/auth/change-password';
  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const { colors } = useTheme();

  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });

  const onUpdatePassword = async () => {

    const data = {
      "oldPassword": password,
      "newPassword": repassword,
    };
    try {
      await authAxios.put(SERVER_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then(() => {
        navigation.navigate('SignIn');
      })
    }
    catch (error) {
      setSavingProfile(false)
      Snackbar.show({
        text: error.data,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: t('tryAgain'),
          textColor: 'green',
          onPress: () => { navigation.goBack() },
        },
      })
    }
  };


  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('change_password')}
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
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            padding: 20,
          }}>
          {savingProfile ?
            <AnimatedLoader
              visible={true}
              overlayColor="rgba(255,255,255,0.75)"
              source={require("../../assets/images/8447-loader-animation.json")}
              animationStyle={styles.lottie}
              speed={1}
            >
              <Text>{t('loading')}</Text>
            </AnimatedLoader>
            :
            null
          }
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('password')}
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('new_password')}
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setRepassword(text)}
            secureTextEntry={true}
            placeholder={t('password_confirm')}
            value={repassword}
          />
          <View style={{ paddingVertical: 15 }}>
            <Button
              loading={loading}
              full
              onPress={() => onUpdatePassword()}>
              {t('confirm')}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
