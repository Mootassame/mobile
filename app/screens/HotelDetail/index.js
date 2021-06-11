import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Animated, RefreshControl, Button } from "react-native";
import { useTheme, authAxios, Images } from "@config";
import { Header, SafeAreaView, Icon, Detail } from "@components";
import { useSelector } from 'react-redux';

import * as Utils from "@utils";
import styles from "./styles";

export default function HotelDetail({ route, navigation }) {
  const language = useSelector(state => state.application.language);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [category, setcategory] = useState("");
  const [iframe, setIframe] = useState("");
  const [refreshing, setRefreshing] = useState(false);


  const [region, setRegion] = useState("")

  const [image, setImage] = useState("");

  const { infoId } = route.params;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    authAxios.get(`tenant/60bf564c30d647001d320329/informations/${infoId}`)

      .then((json) => {


        setcategory([json.data]);
        for (const iterator of json.data.images) {
          setImage(iterator.downloadUrl);
        }
        if (json.data.googleMapsPosition) {

          setRegion(json.data.googleMapsPosition)

          // setLatitude(json.data.googleMapsPosition.split(", ")[0]);

          // setLongitude(json.data.googleMapsPosition.split(", ")[1]);
        }
        if (json.data.videos) {
          const post0 = json.data.videos.split("watch?v=")[1];
          const iframe = post0.split("&")[0];
          setIframe(iframe);
        }
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
      });

  });



  useEffect(() => {
    onRefresh()
  }, []);

  const deltaY = new Animated.Value(0);
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;
  const { colors } = useTheme();

  const ItemView = ({ item }) => {
    if (language === "fr") {
      return <Detail
        title={item.titleFR}
        description={item.descriptionFR}
        address={item.addressFR}
        site_web={item.site_web}
        num_Tel={item.num_Tel}
        email={item.email}
        iframe={iframe}
        regions={region}


      />
    }
    else if (language === 'en') {
      return <Detail
        title={item.titreAR}
        description={item.descriptionEN}
        address={item.addressFR}
        site_web={item.site_web}
        num_Tel={item.num_Tel}
        email={item.email}
        iframe={iframe}
        regions={region}

      />
    }
    else if (language === 'ar') {
      return <Detail
        title={item.titreAR}
        description={item.descriptionAR}
        address={item.addressAR}
        site_web={item.site_web}
        num_Tel={item.num_Tel}
        email={item.email}
        iframe={iframe}
        regions={region}

      />
    }

  }
  return (
    <View style={{ flex: 1 }}>
      {image ? (
        <Animated.Image
          source={{
            uri: `${image}`,
          }}
          style={[
            styles.imgBanner,
            {
              height: deltaY.interpolate({
                inputRange: [
                  0,
                  Utils.scaleWithPixel(200),
                  Utils.scaleWithPixel(200),
                ],
                outputRange: [heightImageBanner, heightHeader, heightHeader],
              }),
            },
          ]}
        />
      ) : null}

      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        {/* Header */}
        <Header
          title=""
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
              <Icon name="images" size={20} color={colors.primary} />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}

          onPressRight={() => {
            navigation.navigate("PreviewImage", {
              imageId: infoId,
            });
          }}
        />

        <FlatList
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: deltaY },
              },
            },
          ])}

          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
          style={{ paddingLeft: 5, paddingRight: 20, paddingTop: 28 }}
          data={category}
          keyExtractor={(item, index) => item.id}
          renderItem={ItemView}
        />

      </SafeAreaView>
    </View>
  );
}
