import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, FlatList, RefreshControl } from 'react-native';
import { BaseStyle, BaseColor, Images, useTheme, BaseSetting } from '@config';
import { useTranslation } from 'react-i18next';
import { Header, SafeAreaView, Icon, Text, Button, TextInput, Image, BookingHistory } from '@components';
import styles from './styles';

import { TabView, TabBar } from 'react-native-tab-view';

import { Title, FAB, Portal, Provider } from 'react-native-paper';
import Axios from 'axios';
import Snackbar from 'react-native-snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';
import AnimatedLoader from "react-native-animated-loader";

export default function BusList({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
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

  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [message, setMessage] = useState('');
  // const [success, setSuccess] = useState({
  //   name: true,
  //   email: true,
  //   message: true,
  // });
  // const [region] = useState({
  //   latitude: 10.73902,
  //   longitude: 106.704938,
  //   latitudeDelta: 0.009,
  //   longitudeDelta: 0.004,
  // });

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */

  const currentUser = useSelector((state) => state.media.user_id);

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
          title={t('assistance')}
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

        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  else {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
        <Header
          title={t('assistance')}
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
    getTestimonies();
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
          if (res.data.rows[i].createdBy === currentUser.id && (res.data.rows[i].status === 'waiting' || res.data.rows[i].status === 'open') && res.data.rows[i].testimonyType === 'assistance') {
            this.openTestimonies.push(res.data.rows[i]);
          }
        }
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
    navigation.navigate('BusSearch');
  }

  const renderItem = item => {
    return (
      <View>
        {language === 'fr' ?
          <BookingHistory
            name={item.category.titleFR}
            checkIn={item.description}
            price={t(item.status)}
            style={{ paddingVertical: 10, marginHorizontal: 20 }}
            onPress={() => {
              openTestimony(item)
            }}
          />
          :
          null
        }
        {language === 'ar' ?
          <BookingHistory
            name={item.category.titleAR}
            checkIn={item.description}
            price={t(item.status)}
            style={{ paddingVertical: 10, marginHorizontal: 20 }}
            onPress={() => {
              openTestimony(item)
            }}
          />
          :
          null
        }
        {language === 'en' ?
          <BookingHistory
            name={item.category.titleEN}
            checkIn={item.description}
            price={t(item.status)}
            style={{ paddingVertical: 10, marginHorizontal: 20 }}
            onPress={() => {
              openTestimony(item)
            }}
          />
          :
          null
        }
      </View>
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
                label: t('sendAssistance'),
                color: colors.primary,
                onPress: () => navigation.navigate('BusFilter'),
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
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  [refreshing] = useState(false);
  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });
  openTestimonies = [];
  useEffect(() => {
    getTestimonies();
  },
    []
  );

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
          if (res.data.rows[i].createdBy === currentUser.id && res.data.rows[i].status === 'closed' && res.data.rows[i].testimonyType === 'assistance') {
            this.closedTestimonies.push(res.data.rows[i]);
          }
        }
        setTestimonies(this.closedTestimonies);
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
    navigation.navigate('BusSearch');
  }

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

  const renderItem = item => {
    return (
      <View>
        {language === 'fr' ?
          <BookingHistory
            name={item.category.titleFR}
            checkIn={item.description}
            price={t(item.status)}
            style={{ paddingVertical: 10, marginHorizontal: 20 }}
            onPress={() => {
              openTestimony(item)
            }}
          />
          :
          null
        }
        {language === 'ar' ?
          <BookingHistory
            name={item.category.titleAR}
            checkIn={item.description}
            price={t(item.status)}
            style={{ paddingVertical: 10, marginHorizontal: 20 }}
            onPress={() => {
              openTestimony(item)
            }}
          />
          :
          null
        }
        {language === 'en' ?
          <BookingHistory
            name={item.category.titleEN}
            checkIn={item.description}
            price={t(item.status)}
            style={{ paddingVertical: 10, marginHorizontal: 20 }}
            onPress={() => {
              openTestimony(item)
            }}
          />
          :
          null
        }
      </View>
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
