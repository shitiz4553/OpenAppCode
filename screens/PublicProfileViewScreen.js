import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import { Appbar, Avatar, Button, Caption, MD2Colors } from "react-native-paper";
import assets from "../assets/assets";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from "@expo/vector-icons";
import useStore from "../store";
import PostsTab from "../components/PostsTab";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();


function PublicProfileViewScreen({navigation,route}){

  const {user} = route.params;


    return (
      <View style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff",
            justifyContent: "space-between",
            elevation: 0,
          }}
        >
          <Appbar.Action
            icon={() => {
              return (
                <Ionicons
                  name="ios-chevron-back-outline"
                  size={24}
                  color="black"
                />
              );
            }}
            onPress={() => navigation.goBack()}
          />
          <Image source={assets.logo} style={{ height: 25, width: 160 }} />
          <Appbar.Action />
        </Appbar.Header>
        <View style={styles.contentContainer}>
          <View style={styles.avatarHolder}>
            <Avatar.Image
              style={{ elevation: 10 }}
              source={{ uri: user?.userProfilePic }}
              size={55}
            />
          </View>
          <View style={styles.rightHolder}>
            <View style={styles.userDataContaienr}>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {user?.userName}
                </Text>
                <Text style={{ fontSize: 16 }}>{user?.userBio}</Text>
              </View>
            </View>
          </View>
        </View>

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#84a59d",
            tabBarInactiveTintColor: "gray",
            tabBarShowLabel: false,
            tabBarShowIcon: true,
            tabBarIndicatorStyle: {
              height: 2,
              backgroundColor: "#84a59d",
            },
          }}
        >
          <Tab.Screen
            name="Posts"
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialIcons name="grid-on" size={22} color={color} />
              ),
            }}
            component={PostsScreen}
          />
        </Tab.Navigator>
      </View>
    );}
export default PublicProfileViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 15,
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  avatarHolder: {
   paddingLeft:15
  },
  rightHolder: {
    flex:1
  },
  userDataContaienr: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft:15
  },
  bioholder:{
    backgroundColor:'white',
    paddingHorizontal:20,
  }
});


const PostsScreen = () => {
    return(
      <PostsTab />
    )
}
