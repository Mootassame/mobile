import { StyleSheet } from "react-native";
import { BaseColor } from "@config";
import * as Utils from "@utils";

export default StyleSheet.create({
  inputItem: {
    flex: 6.5,
    paddingLeft: 10
  },
  button:{
    marginTop:10
  },
  blockImage: {
    height: Utils.scaleWithPixel(250),
    width: "90%",
    borderRadius: 10,
    
  },
  imagesGroup:{
    flexDirection:'row',
    alignSelf:'center',
  },
  titleView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});
