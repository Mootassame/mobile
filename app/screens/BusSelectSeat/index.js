import React, { useState, Component } from 'react';
import { BaseStyle, BaseColor, useTheme, BaseSetting, Images } from '@config';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';
import Modal from 'react-native-modal';
import { ScrollView, View, FlatList, I18nManager, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Header, SafeAreaView, TextInput, Icon, Text, Button, EventCard, ListThumbCircle } from '@components';
import { styles } from './styles';
import VideoPlayer from 'react-native-video-player';
import { Title, FAB, Portal, Provider } from 'react-native-paper';
import Axios from 'axios';
import Snackbar from 'react-native-snackbar';
import AnimatedLoader from "react-native-animated-loader";
import Moment from 'moment';

export default function BusSelectSeat({ navigation }) {

  const SERVER_URL_ACTIVITY = '/tenant/' + BaseSetting.tenantId + '/activity';

  const images = useSelector(state => state.media.images);
  const video = useSelector(state => state.media.video);
  const files = useSelector(state => state.media.files);
  const audio = useSelector(state => state.media.audio);

  const currentTestimony = useSelector(state => state.media.testimony_id);
  const token = useSelector(state => state.media.token);
  const [sendingTestimony, setSendingTestimony] = useState(false);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date())
  const [refreshing] = useState(false);

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  uploadPicture = () => {
    navigation.navigate('CheckOut');
  };
  uploadFile = () => {
    navigation.navigate('Coupons');
  }
  uploadVideo = () => {
    navigation.navigate('More');
  };

  uploadAudio = () => {
    navigation.navigate('OurService');
  };

  removePhoto = async (index) => {
    dispatch(MediaActions.onRemoveImage(index));
    setRefresh(!refresh);
  }
  removeFile = async (index) => {
    dispatch(MediaActions.onRemoveFile(index));
    setRefresh(!refresh);
  }
  removeVideo = async () => {
    dispatch(MediaActions.onAddVideo(null));
    setRefresh(!refresh);
  }
  removeAudio = async () => {
    dispatch(MediaActions.onAddAudio(null));
    setRefresh(!refresh);
  }


  reset = () => {
    setComment('');
    dispatch(MediaActions.onResetMedia());
    setRefresh(!refresh);
  }

  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('/');
    return (-1 !== index) ? url.substring(index + 1) : url;
  }

  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {

    return Promise.reject(error.response);
  });

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
      //   setSendingTestimony(false)
      // )
    }
    catch (error) {
      setSendingTestimony(false)
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

  saveActivity = async () => {
    setSendingTestimony(true)
    let documents = [];
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        const data = await getCredentials(files[i], 'activityDocuments');
        uploadToServer(files[i], data);
        documents.push({
          name: files[i].name,
          privateUrl: data.data.privateUrl,
          publicUrl: '',
        })
      }
    }
    let imgs = [];
    if (images !== null) {
      for (let i = 0; i < images.length; i++) {
        const data = await getCredentials(images[i], 'activityImages');
        uploadToServer(images[i], data);
        imgs.push({
          name: this.getFilenameFromUrl(images[i].uri),
          privateUrl: data.data.privateUrl,
          publicUrl: '',
        })
      }
    }
    let vid = [];
    if (video !== null) {
      const data = await getCredentials(video, 'activityVideo');
      uploadToServer(video, data);
      vid.push({
        name: video.name,
        privateUrl: data.data.privateUrl,
        publicUrl: '',
      })
    }

    let aud = [];
    if (audio !== null) {
      const data = await getCredentials(audio, 'activityAudio');
      uploadToServer(audio, data);
      aud.push({
        name: audio.name,
        privateUrl: data.data.privateUrl,
        publicUrl: '',
      })
    }

    const data = {
      "data": {
        "comment": comment,
        "images": imgs,
        "video": vid,
        "audio": aud,
        "documents": documents,
        "testimony": currentTestimony._id,
        "date": date
      }
    }
    try {
      await authAxios.post(SERVER_URL_ACTIVITY, data, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then(() => {
        setSendingTestimony(false),
          this.reset(),
          Snackbar.show({
            text: t('activitySaved'),
            duration: Snackbar.LENGTH_LONG,
          }),
          navigation.navigate('AddPayment')
      })
    }
    catch (error) {
      setSendingTestimony(false),
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
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>
          <Header
            style={styles.title}
            title={t('activity')}
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
          {sendingTestimony ?
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
          <Text headline semibold style={{ margin: 10 }}>
            {t('detail')}
          </Text>
          <TextInput
            style={{ margin: 5, height: 100 }}
            onChangeText={(text) => setComment(text)}
            multiline={true}
            placeholder={t('comment')}
            textAlignVertical='top'
            value={comment}

          />

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
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
                      date={date}
                      onDateChange={setDate}
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
                    {t('confirm_date')}
                  </Text>
                  <Text headline semibold numberOfLines={1}>
                    {Moment(date).format('YYYY/MM/DD')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text headline semibold style={{ margin: 10 }}>
            {t('attachment')}
          </Text>

          {images.length !== 0 ?
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
                data={images}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                  <View>
                    <EventCard
                      image={item}
                      onPress={() => this.removePhoto(index)}
                      style={{ marginRight: 15 }}
                    />
                  </View>
                )}
              />
            </View>

            :
            null
          }

          {video ?
            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('video')}
              </Text>
              <Icon
                name="times-circle"
                size={22}
                color={colors.primary}
                onPress={() => this.removeVideo()}
                style={{ alignSelf: 'flex-start' }}
              />
              <VideoPlayer
                video={{ uri: video.uri }}
                thumbnail={{ uri: video.uri }}
                endThumbnail={{ uri: video.uri }}
              />
            </View>
            :
            null
          }

          {audio ?
            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('audio')}
              </Text>
              <Icon
                name="times-circle"
                size={22}
                color={colors.primary}
                onPress={() => this.removeAudio()}
                style={{ alignSelf: 'flex-start' }}
              />
              <View style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 10,

              }}>
                <VideoPlayer
                  video={{ uri: audio.uri }}
                  thumbnail={{ uri: Images.audio }}
                  duration={audio.duration}
                />
              </View>
            </View>
            :
            null
          }

          {files.length !== 0 ?
            <View style={styles.titleView}>
              <Text title3 semibold>
                {t('file')}
              </Text>
              {files.map((item, key) => (
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

            :
            null
          }

        </ScrollView>
        <Provider style={styles.fab}>
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? 'close' : 'plus'}
              actions={[
                {
                  icon: 'file',
                  label: t('addFile'),
                  color: colors.primary,
                  onPress: () => this.uploadFile()
                },
                {
                  icon: 'camera',
                  label: t('addImage'),
                  color: colors.primary,
                  onPress: () => this.uploadPicture(),
                },
                {
                  icon: 'video',
                  label: t('addVideo'),
                  color: colors.primary,
                  onPress: () => this.uploadVideo(),
                },
                {
                  icon: 'microphone',
                  label: t('addAudio'),
                  color: colors.primary,
                  onPress: () => this.uploadAudio(),
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

      </View>
      <View
        style={[styles.contentButtonBottom, { borderTopColor: colors.border }]}>
        <View style={{ alignItems: 'flex-start' }}>
          <Text title4 primaryColor semibold style={{ marginRight: 5 }}>
            {t('warning')}
          </Text>
          <Text caption1 semibold>
            {t('irreversibleAction')}
          </Text>
        </View>
        <Button
          loading={loading}
          onPress={() => this.saveActivity()}
          disabled={!Boolean(comment)}
          style={!Boolean(comment) ?
            styles.inactiveStyle : styles.activeStyle}
        >
          {t('send')}
        </Button>
      </View>
    </View>
  );
}
