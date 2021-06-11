import React from "react";

import { View, TouchableOpacity, Linking } from "react-native";
import PropTypes from "prop-types";
import { useTheme } from "@config";
import { Text, Icon } from "@components";
import styles from "./styles";
export default function HelpBlock(props) {
  const { colors } = useTheme();
  const { style, title, onPress, phone, email } = props;

  return (
    <View style={[styles.content, style]}>
      {phone ? (
        <View style={styles.itemReason}>
          <Icon name="phone" size={18} color={colors.accent} />
          <View style={{ marginLeft: 10 }}>
            <TouchableOpacity
              style={(styles.contentBlockCall, { paddingBottom: 7 })}
              onPress={() => {
                Linking.openURL(`tel:${phone}`);
              }}
              activeOpacity={0.9}
            >
              <Text subhead semibold>
                {phone}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {title ? (
        <View style={styles.itemReason}>
          <Icon name="globe" size={18} color={colors.accent} />
          <View style={{ marginLeft: 10 }}>
            <TouchableOpacity
              style={(styles.contentBlockCall, { paddingBottom: 7 })}
              onPress={() => {
                Linking.openURL(title);
              }}
              activeOpacity={0.9}
            >
              <Text subhead semibold>
                {title}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {email ? (
        <View style={styles.itemReason}>
          <Icon name="envelope" size={18} color={colors.accent} />
          <View style={{ marginLeft: 10 }}>
            <TouchableOpacity
              style={(styles.contentBlockCall, { paddingBottom: 7 })}
              onPress={() => {
                Linking.openURL(`mailto:${email}`);
              }}
              activeOpacity={0.9}
            >
              <Text subhead semibold>
                {email}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

HelpBlock.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  title: PropTypes.string,

  phone: PropTypes.string,
  email: PropTypes.string,
};

HelpBlock.defaultProps = {
  style: {},
  onPress: () => {},
  title: "",
  phone: "",
  email: "",
};
