import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';
import * as Utils from "@utils";

export default StyleSheet.create({
  tabbar: {
    height: 40,
  },
  tab: {
    flex: 1,
  },
  indicator: {
    height: 1,
  },
  label: {
    fontWeight: '400',
  },
  containProfileItem: {
    paddingLeft: 20,
    paddingRight: 20,
  },
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
    width: '100%',
    height: '80%',
    borderRadius: 20,
    margin: 5
  },
  imagesGroup: {
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
  titleView: {
    flex: 1,
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
  textView: {
    marginLeft: 10
  },
  textArea: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: BaseColor.fieldColor,
  },
  mapContent: {
    alignSelf: 'center',
    margin: 10,
    padding: 10,
    height: 180,
    width: '95%',
    marginVertical: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  userContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    marginTop: 24,
  },
  userContentMessage: {
    marginTop: 8,
    padding: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    flex: 1,
  },
  userContentDate: {
    // flex: 3, justifyContent: 'center'
    flex: 3,
    justifyContent: 'flex-start',
    marginTop: 50,
    alignItems: 'flex-start',
  },
  meContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  meContentDate: {
    flex: 3,
    justifyContent: 'flex-start',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  meContentMessage: {
    marginTop: 8,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    flex: 1,
  },
  contentList: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10
  },
  contentView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: BaseColor.grayColor,
    margin: 20,
    padding: 10
  },
  roundedImage: {
    height: Utils.scaleWithPixel(300),
    width: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: BaseColor.grayColor,
    // height: 200,
    margin: 10
  },
})

