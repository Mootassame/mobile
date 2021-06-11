import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import * as Utils from "@utils";
import { useTheme } from "@config";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import YoutubePlayer from "react-native-youtube-iframe";
import { View, InteractionManager, Button } from "react-native";
import { Text, HelpBlock, Icon } from "@components";

function Detail(props, navigation) {
  const { colors } = useTheme();

  const {
    title,
    description,
    address,
    site_web,
    num_Tel,
    email,
    iframe,
    regions,
  } = props;

  const { t } = useTranslation();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [renderMapView, setRenderMapView] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  onFileDownload = () => {
    //
  };
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  // if(regions){
  // setLatitude(regions.split(", ")[0]);
  // setLongitude(regions.split(", ")[1]);
  // }

  // console.log(latitude);

  const [region] = useState({
    latitude: 36.71158844363127,
    longitude: 10.262342522894562,
    latitudeDelta: 0.05,
    longitudeDelta: 0.004,
  });

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

      <View style={{ paddingTop: 10 }}>
        <Text headline semibold>
          {t("location")}
        </Text>
        <View
          style={{
            height: 180,
            width: "100%",
            marginTop: 10,
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChange={() => { }}
          >
            <Marker
              coordinate={{
                latitude: 36.71158844363127,
                longitude: 10.262342522894562,
              }}
            />
          </MapView>
        </View>
      </View>
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
      {iframe ? (
        <View style={[styles.blockView, { borderBottomColor: colors.border }]}>
          <Text headline semibold>
            {t("video")}
          </Text>
          <Text body2 numberOfLines={2}></Text>
          <YoutubePlayer height={230} play={false} videoId={iframe} />
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
  iframe: PropTypes.string,

  regions: PropTypes.string,
  onPress: PropTypes.func,
};

Detail.defaultProps = {
  style: {},
  onPress: () => { },
  title: "",
  description: "",
  address: "",
  site_web: "",
  num_Tel: "",
  email: "",
  iframe: "",
  regions: "",
};

function areEqual(prevProps, nextProps) {
  return (
    nextProps.title === prevProps.title &&
    nextProps.description === prevProps.description &&
    nextProps.address === prevProps.address &&
    nextProps.site_web === prevProps.site_web &&
    nextProps.num_Tel === prevProps.num_Tel &&
    nextProps.email === prevProps.email &&
    nextProps.iframe === prevProps.iframe &&
    nextProps.regions === prevProps.regions
  );
}
export default React.memo(Detail, areEqual);