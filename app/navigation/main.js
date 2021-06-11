import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { BaseColor, useTheme, useFont } from "@config";
import { useTranslation } from "react-i18next";
import { Icon } from "@components";
/* Stack Screen */

import Categories from "@screens/Categories";

import ChangeLanguage from "@screens/ChangeLanguage";

import HotelDetail from "@screens/HotelDetail";
import Hotel from "@screens/Hotel";
import NoData from "@screens/NoData";

import Setting from "@screens/Setting";

import ThemeSetting from "@screens/ThemeSetting";

import Home from "@screens/Home";

import News from "@screens/News";
import Profile from "@screens/Profile";

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
  return (
    <MainStack.Navigator
      headerMode="none"
      initialRouteName="BottomTabNavigator"
    >
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />

      <MainStack.Screen name="Categories" component={Categories} />
      <MainStack.Screen name="News" component={News} />
      <MainStack.Screen name="Hotel" component={Hotel} />
      <MainStack.Screen name="HotelDetail" component={HotelDetail} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="NoData" component={NoData} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const font = useFont();
  const auth = useSelector((state) => state.auth);
  const login = auth.login.success;
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      headerMode="none"
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        activeTintColor: colors.primary,
        inactiveTintColor: BaseColor.grayColor,
        style: { borderTopWidth: 1 },
        labelStyle: {
          fontSize: 12,
          fontFamily: font,
        },
      }}
    >
      <BottomTab.Screen
        name="Actualité"
        component={News}
        options={{
          title: t("Actualité"),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="newspaper" size={20} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="Information"
        component={Home}
        options={{
          title: t("Informations"),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="info-circle" size={20} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t("profile"),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="user" size={20} solid />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
