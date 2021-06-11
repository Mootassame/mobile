import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BaseStyle, BaseColor, useTheme, authAxios } from "@config";
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Text,
  SearchH,
} from "@components";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function SearchHistory({ route, navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const { infoId } = route.params;

  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.application.language);

  useEffect(() => {
    setLoading(true);

    authAxios
      .get(
        `tenant/60a6837c57b965001ed6ec2e/informations?filter[category]=${infoId}`
      )
      .then((json) => {
        setFilteredDataSource(json.data.rows);
        setMasterDataSource(json.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource

      const newData = masterDataSource.filter(function (item) {
        if (language === "fr") {
          const itemData =
            item.titleFR + item.descriptionFR
              ? item.titleFR.toUpperCase() + item.descriptionFR.toUpperCase()
              : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        } else if (language === "en") {
          const itemData =
            item.titreEN + item.descriptionEN
              ? item.titreEN.toUpperCase() + item.descriptionEN.toUpperCase()
              : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        } else if (language === "ar") {
          const itemData =
            item.titreAR + item.descriptionAR
              ? item.titreAR.toUpperCase() + item.descriptionAR.toUpperCase()
              : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });

      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    if (language === "en") {
      return (
        <TouchableOpacity
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate("HotelDetail", {
              infoId: item._id,
            });
          }}
        >
          <SearchH
            title={item.titreEN}
            description={item.descriptionEN}
          ></SearchH>
        </TouchableOpacity>
      );
    } else if (language === "fr") {
      return (
        <TouchableOpacity
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate("HotelDetail", {
              infoId: item._id,
            });
          }}
        >
          <SearchH
            title={item.titleFR}
            description={item.descriptionFR}
          ></SearchH>
        </TouchableOpacity>
      );
    } else if (language === "ar") {
      return (
        <TouchableOpacity
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate("HotelDetail", {
              infoId: item._id,
            });
          }}
        >
          <SearchH
            title={item.titreAR}
            description={item.descriptionAR}
          ></SearchH>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: "always" }}>
      <Header
        title={t("search")}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1, padding: 10 }}
      >
        <TextInput
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction("")}
          placeholder={t("search")}
          value={search}
          icon={
            <TouchableOpacity
              onPress={() => {
                searchFilterFunction("");
              }}
              style={styles.btnClearSearch}
            >
              <Icon name="times" size={18} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />

        <Text
          style={{ marginBottom: 10, marginTop: 25, marginLeft: 15 }}
          headline
        >
          {t("SEARCH RESULT").toUpperCase()} {filteredDataSource.length}{" "}
        </Text>

        <ScrollView contentContainerStyle={{ padding: 1 }}>
          <View style={{ paddingTop: 1 }}>
            <FlatList
              data={filteredDataSource}
              maxToRenderPerBatch={10}
              windowSize={21}
              initialNumToRender={10}
              updateCellsBatchingPeriod={50}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
