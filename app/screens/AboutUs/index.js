import React, {useState} from 'react';
import {View, ScrollView, ImageBackground, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [ourTeam] = useState([
    {
      id: '1',
      screen: 'Profile1',
      image: Images.profile2,
      subName: 'CEO Founder',
      name: 'Kondo Ieyasu',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '2',
      screen: 'Profile2',
      image: Images.profile3,
      subName: 'Sale Manager',
      name: 'Yeray Rosales',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '3',
      screen: 'Profile3',
      image: Images.profile5,
      subName: 'Product Manager',
      name: 'Alf Huncoot',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
    {
      id: '4',
      screen: 'Profile4',
      image: Images.profile4,
      subName: 'Designer UI/UX',
      name: 'Chioke Okonkwo',
      description:
        'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
    },
  ]);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('about_us')}
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
      <ScrollView style={{flex: 1}}>
        <ImageBackground source={Images.trip4} style={styles.banner}>
          <Text title1 semibold whiteColor>
            {t('about_us')}
          </Text>
          <Text subhead whiteColor>
            {t('sologan_about_us')}
          </Text>
        </ImageBackground>
        <View style={styles.content}>
          <Text headline semibold>
            {t('who_we_are').toUpperCase()}
          </Text>
          <Text body2 style={{marginTop: 5}}>
          Le Forum Tunsien pour les Droits Economiques et Sociaux (FTDES) est une organisation tunisienne déclarée au journal officiel en 2011.
          Le FTDES est une organisation non gouvernementale, neutre, indépendante de tout parti politique et de toute institution religieuse. 
          Elle a été créée en 2011 dans le but de défendre les droits économiques et sociaux des populations sur le plan national et international. 
          Le FTDES travaille sur les thématiques suivantes : droit du travail, droit des femmes, droits environnementaux et droits des migrants. 
          Le FTDES fait partie de différents réseaux internationaux dont la FIDH, Migreurop, Loujna Tounkaranké, Boats 4 People. 
          Le FTDES fonctionne avec un bureau central situé à Tunis, sous la direction d’un comité directeur. Il compte plusieurs dizaines de membres dans toute la Tunisie et plus de vingt salariés. 
          Le FTDES dispose de sections locales dans les gouvernorats de Kairouan, Monastir et Gafsa.
          </Text>
          <Text headline semibold style={{marginTop: 20}}>
            {t('what_we_do').toUpperCase()}
          </Text>
          <Text body2 style={{marginTop: 5}}>
            - First Class Flights
          </Text>
          <Text body2 style={{marginTop: 5}}>
            - 5 Star Accommodations
          </Text>
          <Text body2 style={{marginTop: 5}}>
            - Inclusive Packages
          </Text>
          <Text body2 style={{marginTop: 5}}>
            - Latest Model Vehicles
          </Text>
        </View>
        <Text headline semibold style={styles.title}>
          {t('meet_our_team').toUpperCase()}
        </Text>
        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          numColumns={2}
          data={ourTeam}
          keyExtractor={(item, index) => 'ourTeam' + index}
          renderItem={({item, index}) => (
            <Card
              image={item.image}
              
              style={{
                flex: 1,
                marginLeft: 15,
                height: 200,
                marginBottom: 20,
              }}>
              <Text footnote whiteColor>
                {item.subName}
              </Text>
              <Text headline whiteColor semibold numberOfLines={1}>
                {item.name}
              </Text>
            </Card>
          )}
        />
        <Text headline semibold style={styles.title}>
          {t('our_service').toUpperCase()}
        </Text>
        <View style={{paddingHorizontal: 20}}>
          {ourTeam.map((item, index) => {
            return (
              <ProfileDescription
                key={'service' + index}
                image={item.image}
                name={item.name}
                subName={item.subName}
                description={item.description}
                style={{marginBottom: 10}}
               
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}