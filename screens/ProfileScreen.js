import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import { Appbar, Avatar, Button, Caption, MD2Colors } from "react-native-paper";
import assets from "../assets/assets";
import Space from "../components/Space";
import Typo from "../components/Typo";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();


function ProfileScreen({navigation}){
    return (
      <View style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff",
            justifyContent: "space-between",
            elevation: 0,
            justifyContent:'center'
          }}
        >
          <Image source={assets.logo} style={{ height: 25, width: 160 }} />

        </Appbar.Header>
        <View style={styles.contentContainer}>
          <View style={styles.avatarHolder}>
          <Avatar.Image
            style={{ elevation: 10 }}
            source={{uri:"https://randomuser.me/api/portraits/men/30.jpg"}}
            size={90}
          />
          <Typo s>Username</Typo>
          </View>
          <View style={styles.rightHolder}>
          <View style={styles.userDataContaienr}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                 66
                </Text>
                <Caption style={{ marginTop: -5 }}>Posts</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
               66
                </Text>
                <Caption style={{ marginTop: -5 }}>Rating</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>245</Text>
                <Caption style={{ marginTop: -5 }}>Completed</Caption>
              </View>
            </View>
            <Space space={10}/>
            <Button
              mode="contained"
              labelStyle={{ color: "white" }}
              style={{ marginHorizontal: 10 }}
              onPress={()=>navigation.navigate("EditProfileScreen")}
            >
              Edit profile
            </Button>
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
        <Tab.Screen
          name="TaggedPosts"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bookmark-border" size={24} color={color} />
            ),
          }}
          component={PostsTaggedScreen}
        />
      </Tab.Navigator>

      </View>
    );}
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 15,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  avatarHolder: {
    alignItems: "center",
  },
  rightHolder: {
    flex:1
  },
  userDataContaienr: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-around",
  },
});


const PostsScreen = () =>{
    return(
        null
    )
}
const PostsTaggedScreen = () =>{
    return(
        null
    )
}