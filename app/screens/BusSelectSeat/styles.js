import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor } from "@config";
import * as Utils from "@utils";

export const styles = StyleSheet.create({
  logo: Platform.select({
    ios: {
      resizeMode: 'contain',
      height: normalize(190),
      width: normalize(190)
    },
    android: {
      resizeMode: 'contain'
    }
  }),

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    flexGrow: 1
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10, // adds the rounded corners
    backgroundColor: '#fff'
  },
  title: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    color: BaseColor.orangeColor
  },
  inputItem: {
    padding: 10
  },
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockImage: {
    height: Utils.scaleWithPixel(150),
    width: "80%",
    borderRadius: 20,
    margin: 5
  },
  imagesGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: 80,
    paddingRight: 80
  },
  titleView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  imageBanner: {
    height: Utils.scaleWithPixel(200),
    borderRadius: 5,
  },
  content: {
    borderRadius: 5,
    // borderWidth: 0.5,
    width: Utils.scaleWithPixel(200),
  },
  icon: {
    alignSelf: 'flex-start',
    marginRight: 30
  },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  activeStyle: {

  },
  inactiveStyle: {
    backgroundColor: 'grey',
    alignItems: 'center',
  },
  picker: {
    flex: 6,
    height: 50,
    margin: 5,
    color: '#000000',
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
  },
  lottie: {
    width: 80,
    height: 80
  },
  itemPick: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
    padding: 10
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

})

