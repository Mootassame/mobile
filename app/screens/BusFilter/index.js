import React, { useState, useEffect } from 'react';
import { useTheme, BaseSetting } from '@config';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import { MediaActions } from '@actions';

import { ScrollView, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Header, TextInput, Icon, Text, Button, EventCard, ListThumbCircle } from '@components';
import { styles } from './styles';

import { FAB, Portal, Provider } from 'react-native-paper';
import Axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import Snackbar from 'react-native-snackbar';

export default function BusFilter({ navigation }) {

  const SERVER_URL_TESTIMONY = '/tenant/' + BaseSetting.tenantId + '/testimony';
  const SERVER_URL_TESTIMONY_CATEGORY = '/tenant/' + BaseSetting.tenantId + '/testimony-category';

  const files = useSelector(state => state.media.files);
  const currentUser = useSelector(state => state.media.user_id);
  const token = useSelector(state => state.media.token);

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [sendingTestimony, setSendingTestimony] = useState(false);

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  useEffect(() => {
    getCategories()
  }, []);

  const authAxios = Axios.create({
    baseURL: BaseSetting.apiUrl + '/api',
    timeout: 1800
  });

  authAxios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    return Promise.reject(error.response);
  });

  const getCategories = async () => {
    try {
      await authAxios.get(SERVER_URL_TESTIMONY_CATEGORY, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then((res) => {
        setCategories(res.data.rows)
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

  removeFile = async (index) => {
    dispatch(MediaActions.onRemoveFile(index));
    setRefresh(!refresh);
  }

  reset = () => {
    setDescription('');
    setCategory('');
    dispatch(MediaActions.onResetMedia());
    setRefresh(!refresh);
  }

  getFilenameFromUrl = (url) => {
    const index = url.lastIndexOf('/');
    return (-1 !== index) ? url.substring(index + 1) : url;
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

  uploadFile = () => {
    navigation.navigate('Coupons');
  }

  saveTestimony = async () => {
    setSendingTestimony(true)
    let documents = [];
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        const data = await getCredentials(files[i], 'testimonyDocuments');
        uploadToServer(files[i], data);
        documents.push({
          name: files[i].name,
          privateUrl: data.data.privateUrl,
          publicUrl: '',
        })
      }
    }
    const data = {
      "data": {
        "description": description,
        "category": category,
        "testimonyType": 'assistance',
        "documents": documents,
        "priority": 'low',
        "status": 'waiting',
        "anonymous": false,
      }
    }
    try {
      await authAxios.post(SERVER_URL_TESTIMONY, data, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': language === 'fr' ? 'es' : language
        },
      }).then(() => {
        setSendingTestimony(false),
          this.reset(),
          Snackbar.show({
            text: t('assistanceSaved'),
            duration: Snackbar.LENGTH_LONG,
          }),
          navigation.navigate('BusList')
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
          <View
            style={{ height: 50 }}
          >
            <View style={styles.picker2}>
              {language === 'fr' ?
                <Picker
                  style={styles.picker}
                  selectedValue={category}
                  onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                >
                  <Picker.Item label="Catégorie" value="" />
                  {categories.map(cat => (
                    <Picker.Item label={cat.titleFR} value={cat._id} />
                  ))}
                </Picker>
                :
                null
              }
              {language === 'ar' ?
                <Picker
                  style={styles.picker}
                  selectedValue={category}
                  onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                >
                  <Picker.Item label="التصنيف" value="" />
                  {categories.map(cat => (
                    <Picker.Item label={cat.titleAR} value={cat._id} />
                  ))}
                </Picker>
                :
                null
              }
              {language === 'en' ?
                <Picker
                  style={styles.picker}
                  selectedValue={category}
                  onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                >
                  <Picker.Item label="Category" value="" />
                  {categories.map(cat => (
                    <Picker.Item label={cat.titleEN} value={cat._id} />
                  ))}
                </Picker>
                :
                null
              }
            </View>
          </View>

          <TextInput
            style={{ margin: 5, height: 100 }}
            onChangeText={(text) => setDescription(text)}
            multiline={true}
            placeholder={t('description')}
            textAlignVertical='top'
            value={description}

          />

          <Text headline semibold style={{ margin: 10 }}>
            {t('attachment')}
          </Text>

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
          onPress={() => this.saveTestimony()}
          disabled={!Boolean(category && description)}
          style={!Boolean(category && description) ?
            styles.inactiveStyle : styles.activeStyle}
        >
          {t('send')}
        </Button>
      </View>
    </View>
  );
}
