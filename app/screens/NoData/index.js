import React from "react";
import { View, ScrollView } from "react-native";
import { BaseStyle, useTheme } from "@config";
import { Header, SafeAreaView, Icon, Text,Button } from "@components";
import { useTranslation } from "react-i18next";


export default function BookingDetail({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
   
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={["right", "left", "bottom"]}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, alignItems: "center" }}
        >
          <Icon
            name="ban"
            size={72}
            color={colors.primaryLight}
            style={{ paddingTop: 50, paddingBottom: 20 }}
          />
          <Text title3 style={{ marginVertical: 25 }} semibold>
          {t("notfound")}
          </Text>
        

          <Button
            full
            style={{marginTop: 10, marginBottom: 20}}
            onPress={()=>{ 
                    navigation.goBack()        
        }}>
            {t('back')}
          </Button>
     
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
