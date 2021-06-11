import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshControl,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { BaseStyle, Images, useTheme, authAxios } from "@config";
import { Header, SafeAreaView, Icon, HotelItem} from "@components";
import styles from "./styles";
import * as Utils from "@utils";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Hotel({ route, navigation }) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const { infoId } = route.params;
  const { Nom } = route.params;

  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: "clamp",
      }),
      offsetAnim
    ),
    0,
    40
  );
  const [information_category, setCat] = useState("");
  const [count, setCount] = useState("");
  const language = useSelector((state) => state.application.language);
  const [offset, setOffset] = useState(6);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    authAxios
      .get(
        `tenant/60a6837c57b965001ed6ec2e/informations?filter[category]=${infoId}&limit=${offset}`
      )

      .then((json) => {
        if(json.data.count==0){
          navigation.replace("NoData")
        }
        setOffset(offset + 6);
        setCat(json.data.rows);
        setCount(json.data.count);
     
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  useEffect(() => {
    onRefresh();
  }, []);

  const ItemView = ({ item }) => {

    switch (language) {
      case "fr":
        return (
          <HotelItem
            list
            image={item.images[0]}
            name={item.titleFR}
            location={item.updatedAt}
            description={item.descriptionFR}
            style={{
              paddingBottom: 10,
            }}
            onPress={() => {
              /* 1. Navigate to the Details route with params */
              navigation.navigate("HotelDetail", {
                infoId: item._id,
              });
            }}
          />
        );
        break;
        case "en":
          return (
            <HotelItem
              list
              image={item.images[0]}
              name={item.titreEN}
              location={item.updatedAt}
              description={item.descriptionEN}
              style={{
                paddingBottom: 10,
              }}
              onPress={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate("HotelDetail", {
                  infoId: item._id,
                });
              }}
            />
          );
          break;
          case "ar":
            return (
              <HotelItem
                list
                image={item.images[0]}
                name={item.titreAR}
                location={item.updatedAt}
                description={item.descriptionAR}
                style={{
                  paddingBottom: 10,
                }}
                onPress={() => {
                  /* 1. Navigate to the Details route with params */
                  navigation.navigate("HotelDetail", {
                    infoId: item._id,
                  });
                }}
              />
            );
            break;
    }

  };

  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          contentContainerStyle={{
            paddingTop: 18,
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          initialNumToRender={6}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollAnim,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          data={information_category}
 
          key={"list"}
          keyExtractor={(item, index) => item.id}
          onEndReached={onRefresh}
          onEndReachedThreshold={0.5}
          renderItem={ItemView}
        />
        <Animated.View
          style={[
            styles.navbar,
            {
              transform: [{ translateY: navbarTranslate }],
            },
          ]}
        ></Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: "always" }}>
      <Header
        title={Nom}
        subTitle={`${t("results")} ${count}`}
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
          return <Icon name="filter" size={22} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate("Filter", { infoId: infoId });
        }}
      />
      <View
        style={{
          marginTop: 6,
          borderBottomColor: "lightgray",
          borderBottomWidth: 0.4,
        }}
      />
      {renderContent()}
    </SafeAreaView>
  );
}
