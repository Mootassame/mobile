import { StyleSheet } from "react-native";
import { BaseColor } from "@config";
import * as Utils from '@utils';

export default StyleSheet.create({
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
  checkDefault: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingVertical: 15,
    marginTop: 10
  },
  blockImage: {
    // height: Utils.scaleWithPixel(200),
    width: '100%',
    height: '80%'
  },
});
