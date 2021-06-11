import React, { useState, useEffect, useRef } from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { Header, SafeAreaView, Icon, Text, ListThumbCircle, Image, Tag } from '@components';
import { ScrollView, View, FlatList, InteractionManager, Platform } from 'react-native';
import { BaseStyle, BaseColor, useTheme, BaseSetting, Images } from '@config';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Title, FAB, Portal, Provider } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';

export default function BusSearch({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'preview', title: t('detail') },
    { key: 'media', title: t('attachment') },
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
  const testimony = useSelector(state => state.media.testimony_id);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>

          <View style={{ flex: 1 }}>
            <Text body1 semibold style={[styles.textView, { marginTop: 10 }]}>
              {t('category')}
            </Text>
            {language === 'fr' ?
              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.category.titleFR}
              </Text>
              :
              null
            }
            {language === 'en' ?
              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.category.titleEN}
              </Text>
              :
              null
            }
            {language === 'ar' ?
              <Text
                style={[styles.textArea]}
                textAlignVertical='top'
              >
                {testimony.category.titleAR}
              </Text>
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
          </View>
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

  const files = useSelector(state => state.media.files);

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView forceInset={{ top: 'always' }} contentContainerStyle={{ flexGrow: 1 }}>

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

