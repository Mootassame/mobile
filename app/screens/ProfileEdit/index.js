import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { BaseStyle, useTheme, BaseSetting, Images } from "@config";
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from "@components";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import { Picker } from "@react-native-community/picker";
import { Country } from "@data";

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

import SyanImagePicker from 'react-native-syan-image-picker';
import Axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import Snackbar from 'react-native-snackbar';
import Moment from 'moment';

export default function ProfileEdit({ navigation }) {
  const currentUser = useSelector((state) => state.media.user_id);
  const token = useSelector((state) => state.media.token);
  const SERVER_URL = '/auth/profile';
  const SERVER_URL_ME = '/auth/me'

  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [birthDate, setBirthDate] = useState(new Date(currentUser.birthDate));
  const [country, setCountry] = useState(currentUser.nationality);
  const [phone, setPhone] = useState(currentUser.phoneNumber);
  const [avatars, setAvatars] = useState([]);
  const [photoUri, setPhotoUri] = useState(
    currentUser.avatars.length !== 0 ?
      BaseSetting.apiUrl + '/api/file/download?privateUrl=' + currentUser.avatars[0].privateUrl
      :
      null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const onUpdateProfileAvatar = async () => {
    SyanImagePicker.asyncShowImagePicker({ imageCount: 1, isGif: true, })
      .then(photos => {
        const arr = photos.map(v => {
          setAvatars([{
            name: this.getFilenameFromUrl(v.uri),
            uri: v.uri,
            type: 'image/' + v.type,
            size: v.size
          }]);
          return v
        });
        setPhotoUri(photos[0].uri);
      })
      .catch(err => {

      })

  }

  const getCredentials = async (file, storageId) => {
    return authAxios.get('/tenant/' + BaseSetting.tenantId + '/file/credentials',
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
        params: {
          filename: file.name,
          storageId: storageId
        }
      },
    )
  }

  const uploadToServer = async (file, data) => {
    try {

      const url = data.data.uploadCredentials.url.replace("http://localhost:8080", BaseSetting.apiUrl);
      const formData = new FormData();
      for (const [key, value] of Object.entries(
        data.data.uploadCredentials.fields || {},
      )) {
        formData.append(key, value);
      }
      formData.append('file', file);
      return authAxios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      })
      // .then(() =>
      //   setSavingProfile(false)
      // )
    }
    catch (error) {
      setSavingProfile(false)
      console.error(error);
      alert(
        t('error'),
        error.message,
        [
          { text: t('tryAgain'), onPress: this.getData },
        ],
        { cancelable: false }
      );
    }
  };

  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('/');
    return (-1 !== index) ? url.substring(index + 1) : url;
  }
  const onUpdateProfile = async () => {
    setSavingProfile(true);
    imgs = [];
    if (currentUser.avatars.length === 0) {
      if (avatars.length !== 0) {
        for (let i = 0; i < avatars.length; i++) {
          const data = await getCredentials(avatars[i], 'userAvatarsProfiles');
          uploadToServer(avatars[i], data);
          this.imgs.push({
            name: this.getFilenameFromUrl(avatars[i].uri),
            privateUrl: data.data.privateUrl,
            publicUrl: '',
          })
        }
      }
    }
    else {
      this.imgs = currentUser.avatars;
      if (avatars.length !== 0) {
        for (let i = 0; i < avatars.length; i++) {
          const data = await getCredentials(avatars[i], 'userAvatarsProfiles');
          uploadToServer(avatars[i], data);
          // imgs.push({
          this.imgs[0].name = this.getFilenameFromUrl(avatars[i].uri)
          this.imgs[0].privateUrl = data.data.privateUrl
          this.imgs[0].publicUrl = ''
          // })
        }
      }
    }
    const data = {
      "data": {
        "email": currentUser.email,
        "fullName": fullName,
        "phoneNumber": phone,
        "birthDate": birthDate,
        "nationality": country,
        "avatars": this.imgs
      }
    };
    try {
      await authAxios.put(SERVER_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then(() => {
        fetchMe(token);
        navigation.goBack();
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
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: "always" }}>
      <Header
        title={t("edit_profile")}
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
        onPressRight={() => { }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
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
        <View>
          <TouchableOpacity onPress={() => onUpdateProfileAvatar()} >
            {photoUri === null ?
              <Image source={Images.image} style={styles.thumb} />
              :
              <Image
                source={{ uri: photoUri }}
                style={styles.thumb} />
            }
          </TouchableOpacity>
          <Text body1 semibold style={{ alignSelf: "center" }}>
            {currentUser.email}
          </Text>
        </View>
        <Text headline semibold style={{ marginTop: 20 }}>
          {t('personalDetails')}
        </Text>
        <TextInput
          style={{ marginTop: 10 }}
          onChangeText={(text) => setFullName(text)}
          placeholder={t('name')}
          value={fullName}
        />

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flex: 7.5 }}>
            <TextInput
              style={{ height: 60 }}
              onChangeText={(text) => setPhone(text)}
              keyboardType="numeric"
              placeholder={t("phone_number")}
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
        <View style={styles.picker2}>
          <Picker
            style={styles.picker}
            selectedValue={country}
            onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
          >
            <Picker.Item label={t('nationality')} value="" />
            {Country.map((count) => (
              <Picker.Item label={t(count)} value={count} />
            ))}
          </Picker>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
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
            style={{ margin: 10, flex: 4 }}
            loading={loading}
            onPress={() => onUpdateProfile()}
          >
            {t('confirm')}
          </Button>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
