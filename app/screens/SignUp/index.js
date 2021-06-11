import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, I18nManager, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme, BaseSetting, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput, Text } from '@components';

import Modal from 'react-native-modal';

import DatePicker from 'react-native-date-picker'

import { Picker } from '@react-native-community/picker';
import { Country } from '@data';

import styles from './styles';
import { useTranslation } from 'react-i18next';

import Snackbar from 'react-native-snackbar';
import Axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';
import Moment from 'moment';
export default function SignUp({ navigation }) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date())
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const [confirm_password, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [success, setSuccess] = useState({
    email: true,
    password: true,
    confirm_password: true,
    validate_pass: true,
  });
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [sendingTestimony, setSendingTestimony] = useState(false);
  const SERVER_URL = '/auth/sign-up-mobile';
  const SERVER_URL_ME = '/auth/me';

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
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: t('tryAgain'),
          textColor: 'green',
          onPress: () => { navigation.goBack() },
        },
      })
    }

  };

  /**
   * call when action signup
   *
   */
  const onSignUp = async () => {
    setLoading(true);
    if (confirm_password == '' || email == '' || password == '' || confirm_password !== password) {
      setSuccess({
        ...success,
        email: email != '' ? true : false,
        password: password != '' ? true : false,
        confirm_password: confirm_password != '' ? true : false,
        validate_pass: confirm_password === password ? true : false,
      });
      Snackbar.show({
        text: t('unvalidPwd'),
        duration: Snackbar.LENGTH_LONG,
      });
    } else {

      const data = {
        "email": email,
        "password": password,
        "fullName": fullName,
        "phoneNumber": phone,
        "birthDate": birthDate,
        "nationality": country
      }
      try {
        await authAxios.post(SERVER_URL, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': language === 'fr' ? 'es' : language
          },
        }).then((res) => {
          fetchMe(res.data),
            setSendingTestimony(false),
            dispatch(MediaActions.onAddToken(res.data)),
            navigation.goBack()
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
        title={t('sign_up')}
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
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <Text headline semibold style={{ marginTop: 20 }}>
          {t('personalDetails')}
        </Text>
        <TextInput
          style={{ marginTop: 10 }}
          onChangeText={(text) => setFullName(text)}
          placeholder={t('name')}
          success={success.fullName}
          value={fullName}
        />

        <View style={styles.picker2}>
          <Picker
            style={styles.picker}
            selectedValue={country}
            onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
          >
            <Picker.Item label={t('nationality')} value="" />
            {Country.map(count => (
              <Picker.Item label={t(count)} value={count} />
            ))}

          </Picker>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ flex: 7.5 }}>
            <TextInput
              style={{ height: 60 }}
              onChangeText={(text) => setPhone(text)}
              keyboardType="numeric"
              placeholder={t('phone_number')}
              value={phone}
            />
          </View>

          <View
            style={[styles.inputItem]}
          >
            <Modal
              isVisible={modalVisible}
              backdropColor="rgba(0, 0, 0, 0.5)"
              backdropOpacity={1}
              animationIn="fadeIn"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}>
              <View style={[styles.contentCalendar, { backgroundColor: colors.card }]}>

                <DatePicker
                  style={{ padding: 5 }}
                  locale={language}
                  date={birthDate}
                  onDateChange={setBirthDate}
                  mode="date"
                />
                <View style={styles.contentActionCalendar}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      // onCancel();
                    }}>
                    <Text body1>{t('cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      // onChange();
                    }}>
                    <Text body1 primaryColor>
                      {t('confirm')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={styles.itemPick}
              onPress={() => setModalVisible(true)}>
              <Text caption1 light style={{ marginBottom: 5 }}>
                {t('birthDate')}
              </Text>
              <Text headline semibold numberOfLines={1}>
                {Moment(birthDate).format('YYYY/MM/DD')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text headline semibold style={{ marginTop: 20 }}>
          {t('connectionDetails')}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ flex: 3 }}>
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={(text) => setEmail(text)}
              placeholder={t('email')}
              keyboardType="email-address"
              success={success.email}
              value={email}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={(text) => setPassword(text)}
              placeholder={t('input_password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={(text) => setConfirmPassword(text)}
              placeholder={t('password_confirm')}
              secureTextEntry={true}
              success={success.confirm_password}
              value={confirm_password}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View
            style={[styles.inputItem]}
          >
            <Modal
              isVisible={modal2Visible}
              backdropColor="rgba(0, 0, 0, 0.5)"
              backdropOpacity={1}
              animationIn="fadeIn"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}>
              <View style={[styles.contentCalendar, { backgroundColor: colors.card, padding: 20 }]}>
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus condimentum dapibus.
                Sed pretium nunc et blandit cursus. Etiam nec dui nunc. Mauris non nisl eros.
                Nullam rutrum dapibus scelerisque.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
                Sed at sapien nec mi venenatis lobortis vitae aliquam leo.
                Curabitur interdum felis orci, et blandit sapien condimentum ac.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Integer tortor arcu, ultricies at ullamcorper vitae, bibendum convallis odio.
                Sed rutrum, tellus a fringilla venenatis, purus turpis tristique urna, nec accumsan arcu augue quis diam.
                Aenean et mattis turpis.
            </Text>

                <View style={styles.contentActionCalendar}>
                  <TouchableOpacity
                    onPress={() => {
                      setModal2Visible(false);
                      // onCancel();
                    }}>
                    <Text body1>{t('cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setAccepted(true)
                      setModal2Visible(false);
                      // onChange();
                    }}>
                    <Text body1 primaryColor>
                      {t('accept')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TouchableOpacity

              style={{ margin: 10, flex: 1, color: colors.primary, alignItems: 'flex-end', }}
              onPress={() => setModal2Visible(true)}>
              <Text body1 primaryColor>
                {t('terms')}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Button
            full
            style={{ margin: 10, flex: 4 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            full
            loading={loading}
            onPress={() => onSignUp()}
            disabled={!Boolean(fullName && email && country && phone && birthDate && accepted)}
            style={!Boolean(fullName && email && country && phone && birthDate && accepted) ?
              styles.inactiveStyle : styles.activeStyle}
          >
            {t('confirm')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
