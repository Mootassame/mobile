import React, { useState } from 'react';
import {
  TouchableOpacity, View
} from 'react-native';
import { BaseStyle, useTheme, Images } from '@config';
import {
  Header,
  SafeAreaView,
  Image,
  Text,
} from '@components';
import { useTranslation } from 'react-i18next';
import styles from './styles';

export default function AddPayment({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  /**
   * @description Call when reminder option switch on/off
   */
  const addTestimony = (value) => {
    navigation.navigate('ContactUs');
  };

  /**
   * @description Call when add Payment
   */
  const addAssistance = () => {
    navigation.navigate('BusList');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('help')}

      />
      <TouchableOpacity style={styles.content} onPress={addTestimony} activeOpacity={1}>
        <Image source={Images.opinions} style={styles.blockImage} />
        <Text body1 grayColor style={{ margin: 10 }}>
          {t('sendTestimony')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={addAssistance} activeOpacity={1}>
        <Image source={Images.focus} style={styles.blockImage} />
        <Text body1 grayColor style={{ margin: 10 }}>
          {t('sendAssistance')}
        </Text>
      </TouchableOpacity>
      <View>
      </View>
    </SafeAreaView>
  );
}
