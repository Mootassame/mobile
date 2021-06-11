import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';
export default StyleSheet.create({

  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  inputItem: {
    flex: 6.5,
    paddingLeft: 10
  },
  picker: {
    flex: 1,
    height: 50,
    margin: 5,
    color: '#000000',
    // backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
  },
  picker2: {
    flex: 6,
    height: 50,
    marginTop: 10,
    color: '#000000',
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
  },
  contentPickDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 10,
  },
  itemPick: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 8,
    paddingLeft: 10
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
  activeStyle: {
    margin: 10, flex: 4
  },
  inactiveStyle: {
    backgroundColor: 'grey',
    margin: 10, flex: 4
  },
});
