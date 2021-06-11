import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView, Text, Button, Image, Icon } from "@components";
import styles from "./styles";
import { BaseColor, BaseStyle, Images, useTheme } from "@config";
import * as Utils from "@utils";
import { useTranslation } from "react-i18next";
import { ApplicationActions } from "@actions";

export default function Walkthrough({ navigation }) {
  const [loadingFR, setLoadingFR] = useState(false);
  const [loadingEN, setLoadingEN] = useState(false);
  const [loadingAR, setLoadingAR] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const saveLanguage = (item) => {
    switch (item) {
      case "fr":
        setLoadingFR(true);
        break;

      case "en":
        setLoadingEN(true);
        break;

      case "ar":
        setLoadingAR(true);
        break;
    }

    const oldLanguage = i18n.language;
    dispatch(ApplicationActions.onChangeLanguage(item));
    i18n.changeLanguage(item);

    setTimeout(() => {
      Utils.reloadLocale(oldLanguage, item);
      navigation.replace("Main");
    }, 500);
  };

  /**
   * @description Simple authentication without call any APIs
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={["right", "left", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.contain}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }
      >
        <View style={styles.wrapper}>
          <Image
            style={{ height: "100%" }}
            resizeMode="contain"
            resizeMethod="scale"
            resizeMethod="auto"
            source={Images.event1}
          />
        </View>
        <View style={{ width: "100%" }}>
          <Button
            full
            style={{
              backgroundColor: BaseColor.navyBlue,
              marginTop: 20,
            }}
            loading={loadingEN}
            onPress={() => {
              saveLanguage("en");
            }}
          >
            <Text style={styles.buttonTextStyle}> English </Text>
          </Button>
          <Button
            full
            style={{
              backgroundColor: BaseColor.kashmir,
              marginTop: 20,
            }}
            loading={loadingFR}
            onPress={() => {
              saveLanguage("fr");
            }}
          >
            <Text style={styles.buttonTextStyle}>Français</Text>
          </Button>

          <Button
            full
            style={{
              backgroundColor: BaseColor.greenColor,
              marginTop: 20,
            }}
            loading={loadingAR}
            onPress={() => {
              saveLanguage("ar");
            }}
          >
            <Text style={styles.buttonTextStyle}> العربية </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
