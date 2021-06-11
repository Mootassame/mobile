import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MediaActions } from '@actions';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BaseStyle, useTheme, BaseSetting } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, TextInput } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import Axios from 'axios';
import Snackbar from 'react-native-snackbar';

export default function SignIn({ navigation }) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ id: true, password: true });

  /**
   * call when action login
   *
   */
  const SERVER_URL = '/tenant/' + BaseSetting.tenantId + '/auth/sign-in'
  const SERVER_URL_ME = '/auth/me'

  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });

  const fetchMe = async (token) => {
    try {
      await authAxios.get(SERVER_URL_ME, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then((res) => {
        dispatch(MediaActions.onCurrentUser(res.data));
      })
    }
    catch (error) {
      setLoading(false)
      Snackbar.show({
        text: error.data,
        numberOfLines: 2,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: t('tryAgain'),
          textColor: 'green',
          onPress: () => { navigation.goBack() },
        },
      })
    }

  };


  const onLogin = async () => {
    const data = {
      "email": id,
      "password": password
    }
    if (id == '' || password == '') {
      setSuccess({
        ...success,
        id: false,
        password: false,
      });
    }
    else {
      try {
        await authAxios.post(SERVER_URL, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': language === 'fr' ? 'es' : language
          },
        }).then((res) => {
          const token = res.data;
          dispatch(MediaActions.onAddToken(res.data));
          fetchMe(token);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigation.goBack();
          }, 500);
        })
      }
      catch (error) {
        setLoading(false)
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
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('sign_in')}
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
        style={{ flex: 1 }}>
        <View style={styles.contain}>
          <TextInput
            onChangeText={(text) => setId(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                id: true,
              });
            }}
            placeholder={t('email')}
            success={success.id}
            value={id}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setPassword(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                password: true,
              });
            }}
            placeholder={t('input_password')}
            secureTextEntry={true}
            success={success.password}
            value={password}
          />
          <Button
            disabled={!Boolean(id && password)}
            style={!Boolean(id && password) ?
              styles.inactiveStyle : styles.activeStyle}
            full
            loading={loading}
            onPress={() => {
              onLogin();
            }}>
            {t('sign_in')}
          </Button>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}>
            <Text body1 grayColor style={{ marginTop: 25 }}>
              {t('forgot_your_password')}
            </Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
