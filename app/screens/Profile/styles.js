import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contentTitle: {
    alignItems: "flex-start",
    width: "100%",
    height: 32,
    justifyContent: "center",
  },
  contain: {
    flex: 1,
    padding: 20
  },
  textInput: {
    height: 56,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: "100%"
  },
  profileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: 46,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: BaseColor.grayColor,
    margin: 20,
    padding: 10
  },
  blockImage: {
    // height: Utils.scaleWithPixel(200),
    width: '100%',
    height: '80%'
  },
});
