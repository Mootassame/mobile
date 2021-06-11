import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import * as Utils from "@utils";
import { useTheme } from "@config";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import YoutubePlayer from "react-native-youtube-iframe";
import Snackbar from "react-native-snackbar";

import {
  View,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
} from "react-native";
import { Text, HelpBlock, Icon } from "@components";
import { WebView } from "react-native-webview";
import RNFetchBlob from "rn-fetch-blob";

function Detail(props, navigation) {
  const { colors } = useTheme();

  const {
    title,
    description,
    address,
    num_Tel,
    site_web,
    email,
    latitude,
    longitude,
    document,
    iframe,
  } = props;

  const { t } = useTranslation();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [renderMapView, setRenderMapView] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  const url = Platform.select({
    android:
      "google.navigation:q=" +
      parseFloat(latitude) +
      "," +
      parseFloat(longitude),
  });

  const checkPermission = async (filename) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "Application needs access to your storage to download File",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(filename);
      } else {
        // If permission denied then show alert
      }
    } catch (err) {
      // To handle permission related exception
    }
  };

  const downloadFile = (filename) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = filename;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = "." + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        Snackbar.show({
          text: `${t("Filesuccessful")}`,
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ paddingLeft: 10, paddingBottom: 10 }}
        onPress={() => {
          checkPermission(item.downloadUrl);
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Icon
            style={{ paddingRight: 12 }}
            name="file-upload"
            size={20}
            color={colors.accent}
            enableRTL={true}
          />
          <Text subhead semibold>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ paddingHorizontal: 17 }}>
      {/* Information */}

      <View
        style={[
          styles.contentBoxTop,
          {
            marginTop: marginTopBanner,
            backgroundColor: colors.card,
            shadowColor: colors.border,
            borderColor: colors.border,
          },
        ]}
      >
        <Text title2 semibold style={{ marginBottom: 5 }}>
          {title}
        </Text>
      </View>

      {/* Rating Review */}
      {description ? (
        <View style={[styles.blockView, { borderBottomColor: colors.border }]}>
          <Text headline semibold>
            {t("description")}
          </Text>
          <Text body2 style={{ marginTop: 5 }}>
            {description}
          </Text>
        </View>
      ) : null}

      {/* Facilities Icon */}

      {address ? (
        <View style={[styles.blockView, { borderBottomColor: colors.border }]}>
          <Text headline semibold>
            {t("address")}
          </Text>
          <Text body2 style={{ marginTop: 5 }}>
            {address}
          </Text>
        </View>
      ) : null}
      {latitude || longitude ? (
        <View style={{ paddingTop: 10 }}>
          <Text headline semibold>
            {t("location")}
          </Text>
          <View
            style={{
              height: 220,
              width: "100%",
              marginTop: 15,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              ref={(c) => (this.mapView = c)}
              onPress={() => Linking.openURL(url)}
              onRegionChange={() => {}}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
              />
            </MapView>
          </View>
        </View>
      ) : null}

      {site_web || num_Tel || email ? (
        <View style={[styles.blockView, { borderBottomColor: colors.border }]}>
          <Text headline semibold>
            {t("contact_us")}
          </Text>

          <HelpBlock
            title={site_web}
            phone={num_Tel}
            email={email}
            style={{ margin: 20 }}
            onPress={() => {
              navigation.navigate("ContactUs");
            }}
          />
        </View>
      ) : null}
      {document.length != 0 ? (
        <View
          style={[
            styles.blockView,
            { borderBottomColor: colors.border, paddingBottom: 25 },
          ]}
        >
          <Text headline semibold style={{ paddingBottom: 15 }}>
            {t("Document")}
          </Text>
          <FlatList
            scrollEventThrottle={8}
            style={{ margin: 20 }}
            data={document}
            keyExtractor={(item, index) => item.id}
            renderItem={ItemView}
          />
        </View>
      ) : null}

      {iframe ? (
              <View style={[styles.blockView, { borderBottomColor: colors.border }]}>

          <Text headline semibold style={{ paddingBottom: 15 }}>
            {t("video")}
          </Text>
          <YoutubePlayer height={300} videoId={iframe} />
        </View>
      ) : null}
    </View>
  );
}

Detail.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  address: PropTypes.string,
  site_web: PropTypes.string,
  num_Tel: PropTypes.string,
  email: PropTypes.string,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  document: PropTypes.array,
  iframe: PropTypes.string,
  onPress: PropTypes.func,
};

Detail.defaultProps = {
  style: {},
  onPress: () => {},
  title: "",
  description: "",
  address: "",
  num_Tel: "",
  site_web: "",
  email: "",
  latitude: "",
  longitude: "",
  document: [],
  iframe: "",
};

function areEqual(prevProps, nextProps) {
  return (
    nextProps.title === prevProps.title &&
    nextProps.description === prevProps.description &&
    nextProps.address === prevProps.address &&
    nextProps.num_Tel === prevProps.num_Tel &&
    nextProps.site_web === prevProps.site_web &&
    nextProps.email === prevProps.email &&
    nextProps.latitude === prevProps.latitude &&
    nextProps.longitude === prevProps.longitude &&
    nextProps.document === prevProps.document  &&
    nextProps.iframe === prevProps.iframe
  
  );
}
export default React.memo(Detail, areEqual);
