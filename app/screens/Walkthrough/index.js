import React, {useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image
  
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {BaseStyle, useTheme, BaseSetting,Images} from '@config';
import {Header, SafeAreaView,Button, Icon, Text} from '@components';
import {ApplicationActions} from '@actions';
import styles from './styles';
import * as Utils from '@utils';


export default function Walkthrough({navigation}) {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();

  const [loading, setLoading] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState(BaseSetting.languageSupport);
  const [languageSelected, setLanguageSelected] = useState(i18n.language);

  /**
   * @description Called when setting language is selected
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {string} select
   */
  const onChange = select => {
    setLanguageSelected(select);
  };

  /**
   * Called when apply change language
   */
  const saveLanguage = () => { 
    if (!loading) {
      setLoading(true);
      const oldLanguage = i18n.language;
      dispatch(ApplicationActions.onChangeLanguage(languageSelected));
      i18n.changeLanguage(languageSelected);

      setTimeout(() => {
        Utils.reloadLocale(oldLanguage, languageSelected);
        navigation.replace("Main");
      }, 500);
    }
  }; 


  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
    
      <View style={styles.contain}>

{/*         
      <Image
 style={{height:"50%"}}
 resizeMode="contain"
 resizeMethod="scale"
 resizeMethod="auto"
source={Images.event1}

/> */}

        <FlatList
          contentContainerStyle={{paddingHorizontal: 20}}
          data={language}
          keyExtractor={item => item}
          renderItem={({item}) => {
            const selected = item == languageSelected;
            return (
              <TouchableOpacity
                style={[styles.item, {borderBottomColor: colors.border}]}
                onPress={() => onChange(item)} >
                <Text
                  body1
                  style={
                    selected
                      ? {
                          color: colors.primary,
                        }
                      : {}
                  }>
                  {Utils.languageFromCode(item)}
                </Text>
                {selected && (
                  <Icon name="check" size={25} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
        />




     <Button
            loading={loading}
            style={{marginBottom:40,margin:14}}
            onPress={() => {
              saveLanguage();
            }}>
             <Icon name="save" size={35} color="white" />
     
          </Button>


     
      </View>
    </SafeAreaView>
  );
}
