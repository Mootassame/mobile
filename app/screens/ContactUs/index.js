import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, FlatList, RefreshControl } from 'react-native';
import { BaseStyle, BaseColor, Images, useTheme, BaseSetting } from '@config';
import { useTranslation } from 'react-i18next';
import { Header, SafeAreaView, Icon, Text, Button, Image, BookingHistory } from '@components';
import styles from './styles';

import AnimatedLoader from "react-native-animated-loader";

import { TabView, TabBar } from 'react-native-tab-view';

import { FAB, Portal, Provider } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

export default function ContactUs({ navigation }) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'in_progress', title: t('in_progress') },
    { key: 'history', title: t('history') },
  ]);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [testimonies, setTestimonies] = useState([]);

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */

  const SERVER_URL = '/tenant/' + BaseSetting.tenantId + '/auth/sign-in'
  const SERVER_URL_ME = '/auth/me';
  const SERVER_URL_TESTIMONY = '/tenant/' + BaseSetting.tenantId + '/testimony';

  const currentUser = useSelector((state) => state.media.user_id);
  const token = useSelector(state => state.media.token);
  const state = useSelector(state => state);

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

  const anounymousLogin = async () => {
    const data = {
      "email": 'anonymous',
      "password": '123456'
    }
    try {
      await authAxios.post(SERVER_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      })
        .then((res) => {
          dispatch(MediaActions.onAddToken(res.data));
          fetchMe(res.data);
          setLoading(false);
          navigation.navigate('Messenger');
        })
    }
    catch (error) {
      console.log(error)
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

  // const anounymousLogin = () => {
  //   setLoading(true)
  //   return fetch(SERVER_URL, {
  //     body: JSON.stringify({
  //       email: 'anonymous',
  //       password: '123456'
  //     }),
  //     headers: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST'
  //   })
  //     .then((response) => response.text())
  //     .then((res) => {
  //       const token = res;
  //       dispatch(MediaActions.onAddToken(res));
  //       fetchMe(res);
  //       setLoading(false);
  //       navigation.navigate('Messenger');
  //     })
  // };

  const signUp = () => {
    setLoading2(true);
    setTimeout(() => {
      setLoading2(false);
      navigation.navigate('SignUp');
    }, 500);
  };

  const signIn = () => {
    setLoading3(true);
    setTimeout(() => {
      setLoading3(false);
      navigation.navigate('SignIn');
    }, 500);
  };

  // Tabs
  // When tab is activated, set what's index value
  const handleIndexChange = index => setIndex(index);

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, { backgroundColor: colors.primary }]}
      style={[styles.tabbar, { backgroundColor: colors.background }]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({ route, focused, color }) => (
        <View style={{ flex: 1, width: 100, alignItems: 'center' }}>
          <Text headline semibold={focused} style={{ color }}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  // Render correct screen container when tab is activated
  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'in_progress':
        return <InProgressTab jumpTo={jumpTo} navigation={navigation} />;
      case 'history':
        return <HistoryTab jumpTo={jumpTo} navigation={navigation} />;
    }
  };

  if (currentUser == null || currentUser.email == 'anonymous') {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
        <Header
          title={t('Testimonies')}
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
        {loading ?
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
          null}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <View style={styles.content} activeOpacity={1}>
            <Image source={Images.blank} style={styles.blockImage} />
            <Text body1 grayColor>
              {t('notConnected')}
            </Text>
          </View>
          <View style={{ padding: 20 }}>
            <Button
              loading={loading3}

              onPress={() => {
                signIn();
              }}>
              {t('sign_in')}
            </Button>
          </View>
          <View style={{ padding: 20 }}>
            <Button
              loading={loading2}

              onPress={() => {
                signUp();
              }}>
              {t('createAccount')}
            </Button>
          </View>

          <View style={{ padding: 20 }}>
            <Button
              onPress={() => {
                anounymousLogin();
              }}>
              {t('sendAnonymousTestimony')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  else {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
        <Header
          title={t('Testimonies')}
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
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
        />

      </SafeAreaView>
    );
  }
}

function InProgressTab({ navigation }) {

  const [testimonies, setTestimonies] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const SERVER_URL_TESTIMONY = '/tenant/' + BaseSetting.tenantId + '/testimony';

  const currentUser = useSelector((state) => state.media.user_id);
  const token = useSelector(state => state.media.token);
  [refreshing] = useState(false);

  openTestimonies = [];
  useEffect(() => {
    getTestimonies()
  },
    []
  );

  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });

  const getTestimonies = async () => {
    try {
      await authAxios.get(SERVER_URL_TESTIMONY, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then((res) => {
        for (let i = 0; i < res.data.count; i++) {
          if (res.data.rows[i].createdBy === currentUser.id && (res.data.rows[i].status === 'waiting' || res.data.rows[i].status === 'open') && res.data.rows[i].testimonyType === 'testimony') {
            this.openTestimonies.push(res.data.rows[i]);
          }
        }
        console.log(this.openTestimonies)
        setTestimonies(this.openTestimonies),
          setLoadingData(false)
      })
    }
    catch (error) {
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

  const { colors } = useTheme();
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */
  const openTestimony = (id) => {
    dispatch(MediaActions.onAddTestimonyId(id));
    navigation.navigate('BookingDetail');
  }

  const renderItem = item => {
    return (
      <BookingHistory
        name={item.title}
        checkIn={item.description}
        total={item.region}
        price={t(item.status)}
        style={{ paddingVertical: 10, marginHorizontal: 20 }}
        onPress={() => {
          openTestimony(item)
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>

      <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>

        {loadingData ?
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
          <View style={{ flex: 1 }}>
            {testimonies.length === 0 ?
              <View style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: BaseColor.grayColor,
                margin: 20,
                padding: 10
              }} activeOpacity={1}>
                <Text body1 grayColor>
                  {t('noData')}
                </Text>
              </View>
              :
              <FlatList
                refreshControl={
                  <RefreshControl
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                    refreshing={this.refreshing}
                    onRefresh={() => { getTestimonies() }}
                  />
                }
                data={testimonies}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => renderItem(item)}
              />
            }
          </View>
        }

      </ScrollView>
      <Provider style={styles.fab}>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'close' : 'plus'}
            actions={[
              {
                icon: 'chat-processing',
                label: t('sendTestimony'),
                color: colors.primary,
                onPress: () => navigation.navigate('Booking'),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
              }
            }}
          />
        </Portal>
      </Provider>
    </View>

  );
}

function HistoryTab({ navigation }) {

  const [testimonies, setTestimonies] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const dispatch = useDispatch();
  closedTestimonies = [];

  const SERVER_URL_TESTIMONY = '/tenant/' + BaseSetting.tenantId + '/testimony';

  const currentUser = useSelector((state) => state.media.user_id);
  const token = useSelector(state => state.media.token);

  [refreshing] = useState(false);

  openTestimonies = [];
  useEffect(() => {
    getTestimonies()
  },
    []
  );
  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });
  const getTestimonies = async () => {
    try {
      await authAxios.get(SERVER_URL_TESTIMONY, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then((res) => {
        for (let i = 0; i < res.data.count; i++) {
          if (res.data.rows[i].createdBy === currentUser.id && res.data.rows[i].status === 'closed' && res.data.rows[i].testimonyType === 'testimony') {
            this.openTestimonies.push(res.data.rows[i]);
          }
        }
        console.log(this.openTestimonies.activity)
        setTestimonies(this.openTestimonies),
          setLoadingData(false)
      })
    }
    catch (error) {
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
  const openTestimony = (id) => {
    dispatch(MediaActions.onAddTestimonyId(id));
    navigation.navigate('BookingDetail');
  }

  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */

  const renderItem = item => {
    return (
      <BookingHistory
        name={item.title}
        checkIn={item.description}
        total={item.region}
        price={t(item.status)}
        style={{ paddingVertical: 10, marginHorizontal: 20 }}
        onPress={() => {
          openTestimony(item)
        }}
      />
    );
  };

  return (
    <View>

      <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>
        {loadingData ?
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
          <View style={{ flex: 1 }}>
            {testimonies.length === 0 ?
              <View style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: BaseColor.grayColor,
                margin: 20,
                padding: 10
              }} activeOpacity={1}>
                <Text body1 grayColor>
                  {t('noData')}
                </Text>
              </View>
              :
              <FlatList
                refreshControl={
                  <RefreshControl
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                    refreshing={this.refreshing}
                    onRefresh={() => { getTestimonies() }}
                  />
                }
                data={testimonies}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => renderItem(item)}
              />
            }
          </View>
        }

      </ScrollView>

    </View>

  );
}