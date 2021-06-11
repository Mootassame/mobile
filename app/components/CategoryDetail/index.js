import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import { BaseStyle, useTheme } from "@config";

import { Text, Icon } from "@components";

function CategoryDetail(props, navigation) {
  const { title, id, onPress } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: colors.border }]}
      onPress={() => {
        navigation.navigate("Hotel");
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Icon
          color={colors.primary}
          size={18}
          solid
          style={{ marginHorizontal: 10 }}
        />
        <Text body1>{title}</Text>
      </View>
      <Icon
        name="angle-right"
        size={18}
        color={colors.primary}
        enableRTL={true}
      />
    </TouchableOpacity>
  );
}

CategoryDetail.propTypes = {
  title: PropTypes.string,
  id: PropTypes.any,
  onPress: PropTypes.func,
};

CategoryDetail.defaultProps = {
  style: {},

  title: "",
  id: "",
};

function areEqual(prevProps, nextProps) {
  return nextProps.id === prevProps.id && nextProps.title === prevProps.title;
}
export default React.memo(CategoryDetail, areEqual);
