import React, { memo, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text, Icon } from "@components";
import { useTheme, Images } from "@config";
import PropTypes from "prop-types";
import Moment from 'moment';
import styles from "./styles";
import { useSelector } from "react-redux";

function HotelItem(props) {
  const { colors } = useTheme();
  const { block, style, image, name, location, onPress,description } = props;
  const no_image = image ? { uri: `${image.downloadUrl}` } : Images.image;
  const language = useSelector((state) => state.application.language);
   if(language === "fr" || language === "en"){
  var date =Moment(location).subtract(10, 'days').calendar()
   }
   else{ 
  var date =Moment(location).format('YYYY-MM-DD')
   }


  const renderBlock = () => {
    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image
            resizeMode={"cover"}
            source={no_image}
            style={styles.blockImage}
          />
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 20 }}>
          <Text title2 semibold style={{ marginTop: 5 }} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.blockContentAddress}>
            <Icon name="calendar-week" color={colors.primaryLight} size={10} />  

            <Text
              caption1
              grayColor
              style={{
                marginLeft: 3,
              }}
              numberOfLines={1}
            > 
        
        {date}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Display hotel item as list
   */
  const renderList = () => {
    return (
      <View style={[styles.listContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
     
            <Image
                 resizeMode={"cover"}
                 source={no_image}
              style={styles.listImage}
            />
        
        </TouchableOpacity>
        <View style={styles.listContentRight}>
          <Text headline semibold numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.listContentRow}>
            <Text
              caption1
              grayColor
              style={{
                marginLeft: 6,
              }}
              numberOfLines={5}
            >
              {description}
            </Text>
          </View>


          <View style={styles.listContentRow}>
            <Icon name="calendar-week" color={colors.primaryLight} size={10} />
            <Text
              caption1
              grayColor
              style={{
                marginLeft: 3,
              }}
              numberOfLines={1}
            >
               {date}
            </Text>
          </View>


        </View>
      </View>
    );
  };

 

 if (block) return renderBlock();
  else return renderList();
}

HotelItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  list: PropTypes.bool,
  block: PropTypes.bool,
  name: PropTypes.string,
  location: PropTypes.string,
  description: PropTypes.string,
  services: PropTypes.array,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

HotelItem.defaultProps = {
  style: {},
  image: "",
  list: true,
  block: false,
  name: "",
  location: "",
  description:"",
  services: [],
  onPress: () => {},
  onPressTag: () => {},
};

function areEqual(prevProps, nextProps) {
  return (
    nextProps.image === prevProps.image &&
    nextProps.name === prevProps.name &&
    nextProps.location === prevProps.location
  );
}
export default memo(HotelItem, areEqual);
