import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Images, BaseColor, useTheme } from "@config";
import { Image, Text, Walkthrough } from "@components";
import styles from "./styles";
import { useSelector } from "react-redux";

export default function Loading({ navigation }) {
  const { colors } = useTheme();
  const languagesa = useSelector((state) => state.application.language);

  const onProcess = () => {
    if (languagesa) {
      setTimeout(() => {
        navigation.replace("Main");
      }, 300);
    } else {
      setTimeout(() => {
        navigation.replace("Walkthrough");
      }, 300);
    }
  };
  useEffect(() => {
    onProcess();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.content}>
        <Text title1 whiteColor semibold>
          Mighrights
        </Text>
        <ActivityIndicator
          size="large"
          color={BaseColor.whiteColor}
          style={{
            marginTop: 20,
          }}
        />
      </View>
    </View>
  );
}
