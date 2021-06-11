import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BaseStyle, BaseColor, Images, useTheme,authAxios } from "@config";
import Swiper from "react-native-swiper";
import { Image, Header, SafeAreaView, Icon, Text } from "@components";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function PreviewImage({ route, navigation }) {
  const { colors } = useTheme();
  const { imageId } = route.params;

  const { t } = useTranslation();

  let flatListRef = null;
  let swiperRef = null;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState("false");
  const [indexSelected, setIndexSelected] = useState(0);
  useEffect(() => {
    setLoading(true);

    authAxios.get(`tenant/60a6837c57b965001ed6ec2e/informations/${imageId}`)
      .then((json) => {
        setImages(json.data.images);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /**
   * call when select image
   *
   * @param {*} indexSelected
   */
  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
    setImages(
      images.map((item, index) => {
        if (index == indexSelected) {
          return {
            ...item,
            selected: true,
          };
        } else {
          return {
            ...item,
            selected: false,
          };
        }
      })
    );
    flatListRef.scrollToIndex({
      animated: true,
      index: indexSelected,
    });
  };

  /**
   * @description Called when image item is selected or activated
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {*} touched
   * @returns
   */
  const onTouchImage = (touched) => {
    if (touched == indexSelected) return;
    swiperRef.scrollBy(touched - indexSelected, false);
  };

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, { backgroundColor: "black" }]}
      forceInset={{ top: "always" }}
    >
      <Header
        style={{ backgroundColor: "black" }}
        title=""
        renderRight={() => {
          return <Icon name="times" size={20} color={BaseColor.whiteColor} />;
        }}
        onPressRight={() => {
          navigation.goBack();
        }}
        barStyle="light-content"
      />
      <Swiper
        ref={(ref) => {
          swiperRef = ref;
        }}
        dotStyle={{
          backgroundColor: BaseColor.dividerColor,
        }}
        paginationStyle={{ bottom: 0 }}
        loop={false}
        activeDotColor={colors.primary}
        removeClippedSubviews={false}
        onIndexChanged={(index) => onSelect(index)}
      >
        {images.map((item, key) => {
          return (
            <Image
              key={key}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
              source={{
                uri: `${item.downloadUrl}`,
              }}
            />
          );
        })}
      </Swiper>
      <View
        style={{
          paddingVertical: 10,
        }}
      >
        <View style={styles.lineText}>
          <Text body2 whiteColor>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : null}
          </Text>
          <Text body2 whiteColor>
            {indexSelected + 1}/{images.length}
          </Text>
        </View>
        <FlatList
          ref={(ref) => {
            flatListRef = ref;
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={images}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                onTouchImage(index);
              }}
              activeOpacity={0.9}
            >
              <Image
                style={{
                  width: 70,
                  height: 70,
                  marginLeft: 20,
                  borderRadius: 8,
                  borderColor:
                    index == indexSelected
                      ? colors.primaryLight
                      : BaseColor.grayColor,
                  borderWidth: 1,
                }}
                source={{
                  uri: `${item.downloadUrl}`,
                }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
