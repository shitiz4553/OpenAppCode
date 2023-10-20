import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import assets from "../assets/assets";
import dynamicStyles from "../components/styles";
import Typo from "../components/Typo";

const NotificationScreen = (props) => {
  const { screenName, backgroundColor, navigation, showHeader } = props;
  const styles = dynamicStyles();
  return (
    <>
      {/* {showHeader && (
        <Appbar.Header
          style={{
            backgroundColor: backgroundColor,
            justifyContent: "space-between",
            borderRadius: 15,
            elevation: 0,
          }}
        >
          <Appbar.Action
            icon={() => {
              return (
                <Ionicons name="arrow-back-outline" size={24} color="black" />
              );
            }}
            onPress={() => navigation.navigate("HomeScreen")}
          />
        </Appbar.Header>
      )} */}
      <View
        style={[
            styles.container,
          { backgroundColor: backgroundColor },
          !showHeader && { paddingTop: 130 },
        ]}
      >
        <Typo style={styles.pageTitle}>Notifications</Typo>
        <Image
          source={assets.wait}
          resizeMode="contain"
          style={{ height: 350, width: 350 }}
        />
        <Typo xl>Sorry🙁</Typo>
        <Typo center grey>
          This page is under construction. We will bring this feature shortly
        </Typo>
      </View>
    </>
  );
};

export default NotificationScreen;
