import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { AuthActions } from '@actions';
import { BaseStyle, useTheme, Images, BaseSetting } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
  Image
} from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';

import * as Utils from '@utils';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

export default function Profile({ navigation }) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const forceDark = useSelector(state => state.application.force_dark);

  const darkOption = forceDark
    ? t('always_on')
    : forceDark != null
      ? t('always_off')
      : t('dynamic_system');

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */

  const currentUser = useSelector((state) => state.media.user_id);
  const SERVER_URL_ME = BaseSetting.apiUrl + '/api/auth/me';
  const dispatch = useDispatch();

  const onLogOut = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(MediaActions.onSignOut());
      // navigation.goBack();
      setLoading(false);
    }, 1000);
  };

  const onLogIn = () => {
    setLoading1(true);
    setTimeout(() => {
      navigation.navigate('SignIn');
      setLoading1(false);
    }, 1000);
  };

  const onSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('SignUp');
      setLoading(false);
    }, 1000);
  };

  if (currentUser == null || currentUser.email == 'anonymous') {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
        <Header
          title={t('profile')}

        />
        <View style={styles.content} activeOpacity={1}>
          <Image source={Images.blank} style={styles.blockImage} />
          <Text body1 grayColor>
            {t('notConnected')}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button full loading={loading1} onPress={() => onLogIn()}>
            {t('sign_in')}
          </Button>
        </View>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button full loading={loading} onPress={() => onSignUp()}>
            {t('createAccount')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  else {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
        <Header
          title={t('profile')}

        />
        <ScrollView>
          <View style={styles.contain}>
            {currentUser.avatars.length === 0 ?
              <ProfileDetail
                style={{ marginBottom: 20 }}
                image={Images.image}
                textFirst={currentUser.fullName}
                textSecond={currentUser.email}
                textThird={currentUser.phoneNumber}
              />
              :
              <ProfileDetail
                style={{ marginBottom: 20 }}
                image={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + currentUser.avatars[0].privateUrl }}
                textFirst={currentUser.fullName}
                textSecond={currentUser.email}
                textThird={currentUser.phoneNumber}
              />
            }
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}>
              <Text body1>{t('edit_profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <Text body1>{t('change_password')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('ChangeLanguage');
              }}>
              <Text body1>{t('language')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text body1 grayColor>
                  {Utils.languageFromCode(i18n.language)}
                </Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('SelectDarkOption');
              }}>
              <Text body1>{t('dark_theme')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text body1 grayColor>
                  {darkOption}
                </Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('AboutUs');
              }}>
              <Text body1>{t('about_us')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text body1 grayColor>
                  {t('about_us')}
                </Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button full loading={loading} onPress={() => onLogOut()}>
            {t('sign_out')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

}
