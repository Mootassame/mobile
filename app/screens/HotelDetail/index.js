import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Animated, RefreshControl, Button } from "react-native";
import { useTheme, authAxios, Images } from "@config";
import { Header, SafeAreaView, Icon, Detail } from "@components";
import { useSelector } from "react-redux";

import * as Utils from "@utils";
import styles from "./styles";

export default function HotelDetail({ route, navigation }) {
  const language = useSelector((state) => state.application.language);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [category, setcategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [iframe, setIframe] = useState("");
  const [document, setDocument] = useState("");
  const { infoId } = route.params;
  const no_image = image ? { uri: `${image}` } : Images.image;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    authAxios
      .get(`tenant/60a6837c57b965001ed6ec2e/informations/${infoId}`)
      .then((json) => {
        setcategory([json.data]);
        for (const iterator of json.data.images) {
          setImage(iterator.downloadUrl);
        }
        if (json.data.googleMapsPosition) {
          setLatitude(json.data.googleMapsPosition.split(", ")[0]);
          setLongitude(json.data.googleMapsPosition.split(", ")[1]);
        }
        if (json.data.document) {
          setDocument(json.data.document);
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

  useEffect(() => onRefresh(), []);

  const deltaY = new Animated.Value(0);
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;
  const { colors } = useTheme();

  const ItemView = ({ item }) => {
    switch (language) {
      case "fr":
        return (
          <Detail
            title={item.titleFR}
            description={item.descriptionFR}
            address={item.addressFR}
            site_web={item.site_web}
            num_Tel={item.num_Tel}
            email={item.email}
            latitude={latitude}
            longitude={longitude}
            document={document}
            iframe={iframe}
       
          />
        );
        break;

      case "en":
        return (
          <Detail
            title={item.titreAR}
            description={item.descriptionEN}
            address={item.addressFR}
            site_web={item.site_web}
            num_Tel={item.num_Tel}
            email={item.email}
            latitude={latitude}
            longitude={longitude}
            document={document}
            iframe={iframe}
    
          />
        );
        break;

      case "ar":
        return (
          <Detail
            title={item.titreAR}
            description={item.descriptionAR}
            address={item.addressAR}
            site_web={item.site_web}
            num_Tel={item.num_Tel}
            email={item.email}
            latitude={latitude}
            longitude={longitude}
            document={document}
            iframe={iframe}
         
          />
        );
        break;
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        source={no_image}
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
            return <Icon name="images" size={20} color={colors.primary} />;
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
