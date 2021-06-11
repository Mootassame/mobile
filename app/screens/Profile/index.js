import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,

} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function Profile({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */


  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('profile')}
    
      />
      <ScrollView>
        <View style={styles.contain}>
      
    
    
      
          
         
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => navigation.navigate('ChangeLanguage')}>
            <Text body1>{t('language')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{marginLeft: 5}}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileItem}
            onPress={() => {
              navigation.navigate('SelectDarkOption');
            }}>
            <Text body1>{t('dark_theme')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{marginLeft: 5}}
              enableRTL={true}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
 
    </SafeAreaView>
  );
}
