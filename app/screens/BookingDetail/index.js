import React, { useState, useEffect, useRef } from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { Header, SafeAreaView, Icon, Text, ListThumbCircle, Tag } from '@components';
import { ScrollView, View, FlatList, InteractionManager, Platform, Image } from 'react-native';
import { BaseStyle, BaseColor, useTheme, BaseSetting, Images } from '@config';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import VideoPlayer from 'react-native-video-player';
import { FAB, Portal, Provider } from 'react-native-paper';
import Moment from 'moment';

export default function BookingDetail({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentTestimony = useSelector(state => state.media.testimony_id);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'preview', title: t('detail') },
    { key: 'media', title: t('attachment') },
    { key: 'history', title: t('history') },
  ]);

  // When tab is activated, set what's index value
  const handleIndexChange = index => {
    setIndex(index);
  };

  // Customize UI tab bar
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
        <View style={{ flex: 1, alignItems: 'center', width: 150 }}>
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
      case 'preview':
        return <PreviewTab jumpTo={jumpTo} navigation={navigation} />;
      case 'media':
        return <MediaTab jumpTo={jumpTo} navigation={navigation} />;
      case 'history':
        return <HistoryTab jumpTo={jumpTo} navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('detail')}
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

/**
 * @description Show when tab Preview activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function PreviewTab() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [language, setLanguage] = useState(i18n.language);
  const [renderMapView, setRenderMapView] = useState(false);
  const testimony = useSelector(state => state.media.testimony_id);
  const tags = useSelector(state => state.media.testimony_id.tags);

  if (testimony.position) {
    [position] = useState({
      latitude: parseFloat(testimony.position.split(', ')[0]),
      longitude: parseFloat(testimony.position.split(', ')[1]),
      latitudeDelta: 0.05,
      longitudeDelta: 0.004,
    });

  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <Text body1 semibold style={[styles.textView, { marginTop: 10 }]}>
              {t('title')}
            </Text>
            <Text
              style={[styles.textArea]}
              textAlignVertical='top'
            >
              {testimony.title}
            </Text>
          </View>
          {language === 'fr' ?
            <View>
              <Text body1 semibold style={[styles.textView]}>
                {t('category')}
              </Text>
              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.category.titleFR}
              </Text>

            </View>
            :
            null
          }
          {language === 'en' ?
            <View>
              <Text body1 semibold style={[styles.textView]}>
                {t('category')}
              </Text>

              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.category.titleEN}
              </Text>

            </View>
            :
            null
          }
          {language === 'ar' ?
            <View>
              <Text body1 semibold style={[styles.textView]}>
                {t('category')}
              </Text>

              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.category.titleAR}
              </Text>

            </View>
            :
            null
          }
          <View>
            <Text body1 semibold style={styles.textView}>
              {t('description')}
            </Text>
            <Text
              style={[styles.textArea, { height: 100 }]}
              textAlignVertical='top'
            >
              {testimony.description}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 6 }}>
              <Text body1 semibold style={styles.textView}>
                {t('contact_details')}
              </Text>
              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.contact}
              </Text>
            </View>
            <View style={{ flex: 6 }}>
              <Text body1 semibold style={styles.textView}>
                {t('region')}
              </Text>
              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.region}
              </Text>
            </View>

          </View>
          {testimony.tags.length !== 0 ?
            <View style={{ flex: 1 }}>
              <Text body1 semibold style={styles.textView}>
                {t('tags')}
              </Text>
              <View style={styles.contentList}>
                {language === 'fr' ?
                  <FlatList
                    contentContainerStyle={{ paddingLeft: 5, paddingRight: 20 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={tags}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                      <Tag
                        primary={item.checked}
                        style={{ marginLeft: 15, width: 80 }}
                        outline={!item.checked}
                      >
                        {item.titleFR}
                      </Tag>
                    )}
                  />
                  :
                  null
                }
                {language === 'en' ?
                  <FlatList
                    contentContainerStyle={{ paddingLeft: 5, paddingRight: 20 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={tags}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                      <Tag
                        primary={item.checked}
                        style={{ marginLeft: 15, width: 80 }}
                        outline={!item.checked}
                      >
                        {item.titleEN}
                      </Tag>
                    )}
                  />
                  :
                  null
                }
                {language === 'ar' ?
                  <FlatList
                    contentContainerStyle={{ paddingLeft: 5, paddingRight: 20 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={tags}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                      <Tag
                        primary={item.checked}
                        style={{ marginLeft: 15, width: 80 }}
                        outline={!item.checked}
                      >
                        {item.titleAR}
                      </Tag>
                    )}
                  />
                  :
                  null
                }

              </View>
            </View>
            :
            null
          }
          {testimony.position ?
            <View style={{ flex: 1 }}>
              <Text body1 semibold style={styles.textView}>
                {t('location')}
              </Text>
              <View style={styles.mapContent}>
                {renderMapView && (
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={this.position}
                    onRegionChange={() => { }}>
                    <Marker
                      coordinate={{
                        latitude: position.latitude,
                        longitude: position.longitude,
                      }}
                    />
                  </MapView>
                )}
              </View>
            </View>
            :
            null
          }

        </ScrollView>
      </View>
    </View>
  );
}

/**
 * @description Show when tab Confirm activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function MediaTab() {

  const SERVER_URL_TESTIMONY = BaseSetting.apiUrl + '/api/tenant/' + BaseSetting.tenantId + '/testimony';
  const testimony = useSelector(state => state.media.testimony_id);
  const images = useSelector(state => state.media.images);
  const video = useSelector(state => state.media.video);
  const files = useSelector(state => state.media.files);
  const audio = useSelector(state => state.media.audio);

  const currentUser = useSelector(state => state.media.user_id);
  const token = useSelector(state => state.media.token);

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const [refreshing] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>

          {testimony.images.length !== 0 ?

            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('image')}
              </Text>
              <FlatList
                columnWrapperStyle={{ alignSelf: 'center' }}
                numColumns={2}
                data={testimony.images}
                extraData={refresh}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                  // <View style={styles.contentView}>
                  <Image
                    source={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.privateUrl }}
                    style={styles.roundedImage}
                  />
                  // </View>
                )}
              />
            </View>

            :
            null
          }

          {testimony.videos.length !== 0 ?
            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('video')}
              </Text>
              <VideoPlayer
                video={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + testimony.videos[0].privateUrl }}
                thumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + testimony.videos[0].privateUrl }}
                endThumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + testimony.videos[0].privateUrl }}
              />
            </View>
            :
            null
          }
          {testimony.audio.length !== 0 ?
            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('audio')}
              </Text>

              <View style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 10,

              }}>
                <VideoPlayer
                  video={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + testimony.audio[0].privateUrl }}
                  thumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + testimony.audio[0].privateUrl }}
                  endThumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + testimony.audio[0].privateUrl }}
                />
              </View>
            </View>
            :
            null
          }

          {testimony.documents.length !== 0 ?
            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('file')}
              </Text>
              {testimony.documents.map((item, key) => (
                <View key={key}>
                  <ListThumbCircle
                    txtContent={item.name}
                  />
                </View>
              ))}
            </View>

            :
            null
          }

        </ScrollView>

      </View>
    </View>
  );
}

/**
 * @description Show when tab Complete activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function HistoryTab({ navigation }) {

  const [state, setState] = React.useState({ open: false });
  const closedTestimony = useSelector(state => state.media.testimony_id);
  const onStateChange = ({ open }) => setState({ open });
  const currentUser = useSelector(state => state.media.user_id);
  const { open } = state;

  const { t } = useTranslation();
  const { colors } = useTheme();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const refFlatList = useRef(null);
  const [input, setInput] = useState('');

  const renderItem = (item) => {
    if (item.createdBy !== currentUser._id) {
      return (
        <View style={styles.userContent}>
          <View style={{ paddingHorizontal: 8, flex: 7 }}>
            <View
              style={[
                styles.userContentMessage,
                { backgroundColor: colors.primaryLight },
              ]}>
              <Text body2 whiteColor>
                {item.comment}
              </Text>
              {item.images.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('image')}
                  </Text>
                  <FlatList
                    contentContainerStyle={{
                      paddingRight: 20,
                      paddingLeft: 5,
                      paddingBottom: 20,
                    }}
                    horizontal={true}
                    data={item.images}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                      <Image
                        source={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.privateUrl }}
                        style={styles.roundedImage}
                      />
                    )}
                  />
                </View>
                :
                null
              }
              {item.video.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('video')}
                  </Text>
                  <VideoPlayer
                    video={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.video[0].privateUrl }}
                    thumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.video[0].privateUrl }}
                    endThumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.video[0].privateUrl }}
                  />
                </View>
                :
                null
              }
              {item.audio.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('audio')}
                  </Text>
                  <VideoPlayer
                    video={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.audio[0].privateUrl }}
                    thumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.audio[0].privateUrl }}
                    endThumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.audio[0].privateUrl }}
                  />
                </View>
                :
                null
              }
              {item.documents.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('file')}
                  </Text>
                  {item.documents.map((item, key) => (
                    <View key={key}>
                      <ListThumbCircle
                        txtContent={item.name}
                      />
                    </View>
                  ))}
                </View>

                :
                null
              }
            </View>

          </View>
          <View style={styles.userContentDate}>
            {item.date ?
              <Text footnote numberOfLines={1}>
                {Moment(item.date).format('YYYY-MM-DD')}
              </Text>
              :
              null
            }
          </View>
        </View>
      );
    }

    else {
      return (
        <View style={styles.meContent}>
          <View style={styles.meContentDate}>
            {item.date ?
              <Text footnote numberOfLines={1}>
                {Moment(item.date).format('YYYY-MM-DD')}
              </Text>
              :
              null
            }
          </View>
          <View style={{ paddingLeft: 8, flex: 7, backgroundColor: colors.card, borderRadius: 8 }}>
            <View
              style={[styles.meContentMessage, { backgroundColor: colors.card }]}>
              <Text body2>{item.comment}</Text>

              {item.images.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('image')}
                  </Text>
                  <FlatList
                    contentContainerStyle={{
                      paddingRight: 20,
                      paddingLeft: 5,
                      paddingBottom: 20,
                    }}
                    horizontal={true}
                    data={item.images}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                      <Image
                        source={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.privateUrl }}
                        style={styles.roundedImage}
                      />
                    )}
                  />
                </View>
                :
                null
              }
              {item.video.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('video')}
                  </Text>
                  <VideoPlayer
                    video={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.video[0].privateUrl }}
                    thumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.video[0].privateUrl }}
                    endThumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.video[0].privateUrl }}
                  />
                </View>
                :
                null
              }

              {item.audio.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('audio')}
                  </Text>
                  <VideoPlayer
                    video={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.audio[0].privateUrl }}
                    thumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.audio[0].privateUrl }}
                    endThumbnail={{ uri: BaseSetting.apiUrl + '/api/file/download?privateUrl=' + item.audio[0].privateUrl }}
                  />
                </View>
                :
                null
              }

              {item.documents.length !== 0 ?
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t('file')}
                  </Text>
                  {item.documents.map((item, key) => (
                    <View key={key}>
                      <ListThumbCircle
                        txtContent={item.name}
                      />
                    </View>
                  ))}
                </View>

                :
                null
              }
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <ScrollView
        forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={refFlatList}
            data={closedTestimony.activity}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({ item }) => renderItem(item)}
          />
        </View>

      </ScrollView>
      { closedTestimony.status === 'closed' ?
        null
        :
        <Provider style={styles.fab}>
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? 'close' : 'plus'}
              actions={[
                {
                  icon: 'chat-processing',
                  label: t('sendActivity'),
                  color: colors.primary,
                  onPress: () => navigation.navigate('BusSelectSeat'),
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        </Provider>
      }

      {/* </View> */}
    </SafeAreaView>
  );
}
