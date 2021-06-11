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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    color: BaseColor.grayColor,
  },
  thumb: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  contentCalendar: {
    borderRadius: 8,
    width: '100%',
  },
  contentActionCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  itemPick: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
    paddingLeft: 10
  },
  inputItem: {
    flex: 6.5,
    paddingLeft: 10,
  },
  picker: {
    flex: 1,
    // marginTop: 10,
    color: "#000000",
    // backgroundColor: BaseColor.fieldColor,
    // borderRadius: 8,
  },
  picker2: {
    flex: 6,
    marginTop: 10,
    color: "#000000",
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
  },
  lottie: {
    width: 80,
    height: 80
  }
});
