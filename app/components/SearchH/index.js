import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import styles from "./styles";

import { View } from "react-native";
import { Text } from "@components";

function SearchH(props) {
  const { title, description } = props;
  const { t } = useTranslation();

  return (
    <View style={{ paddingTop: 20 }}>
      <Text body1 semibold style={{ marginBottom: 5, paddingLeft: 10 }}>
        {title}
      </Text>
      <Text body2 grayColor style={{ marginBottom: 5, paddingLeft: 10 }}>
        {description}
      </Text>
      <View
        style={{
          marginTop: 6,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
}

SearchH.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

SearchH.defaultProps = {
  style: {},
  onPress: () => {},
  title: "",
  description: "",
};

function areEqual(prevProps, nextProps) {
  return (
    nextProps.title === prevProps.title &&
    nextProps.description === prevProps.description
  );
}
export default React.memo(SearchH, areEqual);
