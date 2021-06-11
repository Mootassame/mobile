import { StyleSheet } from "react-native";
import { BaseColor } from "@config";
import * as Utils from "@utils";

export const styles = StyleSheet.create({
  inputItem: {
    flex: 6.5,
    paddingLeft: 10
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
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10, // adds the rounded corners
    backgroundColor: '#fff'
  },
  buttonIcon: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10, // adds the rounded corners
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  title: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  icon: {
    marginRight: 20,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 30
  },
  titleView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});
