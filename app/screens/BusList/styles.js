import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';
import * as Utils from "@utils";

export default StyleSheet.create({
  contain: {
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  fab: {
    position: 'absolute',
    marginTop: 20,
    margin: 16,
    right: 0,
    bottom: 0,
    color: BaseColor.orangeColor
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  lottie: {
    width: 80,
    height: 80
  }
});
