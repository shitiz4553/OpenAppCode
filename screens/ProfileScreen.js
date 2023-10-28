import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { Appbar, Avatar, Button, Caption, MD2Colors } from "react-native-paper";
import assets from "../assets/assets";
import Space from "../components/Space";
import Typo from "../components/Typo";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from "@expo/vector-icons";
import useStore from "../store";
import { FB_AUTH } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostsTab from "../components/PostsTab";
import BookMarksTab from "../components/BookMarksTab";

const Tab = createMaterialTopTabNavigator();


function ProfileScreen({navigation}){

  const userData = useStore((state) => state.userData);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const profileStats = useStore((state) => state.profileStats);


  const handleLogout = async () => {
    // Display a confirmation dialog to confirm the user's intent
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Sign out the user from Firebase Authentication
              await FB_AUTH.signOut();
              await AsyncStorage.setItem('isLoggedIn', 'false');
              const isLoggedInString = await AsyncStorage.getItem('isLoggedIn');
  
              if (isLoggedInString === 'false') {
                setIsLoggedIn(false);
                navigation.replace('LandingScreen');
                console.log('Logged Out Successfully');
              }
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false } // Prevent dismissing the dialog by tapping outside
    );
  };


  const calculateAverageRating = (ratings) => {
    if (ratings && ratings.length > 0) {
      const sumOfRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      return (sumOfRatings / ratings.length).toFixed(1);
    }
    return "0"; // Return "0" as a string when there are no ratings
  };
  
  // Usage:
  const averageRating = calculateAverageRating(userData?.ratings);

    return (
      <View style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff",
            justifyContent: "space-between",
            elevation: 0,
          }}
        >
          <Appbar.Action />
          <Image source={assets.logo} style={{ height: 25, width: 160 }} />
          <Appbar.Action onPress={() => handleLogout()} icon="logout" />
        </Appbar.Header>
        <View style={styles.contentContainer}>
          <View style={styles.avatarHolder}>
            <Avatar.Image
              style={{ elevation: 10 }}
              source={{ uri: userData?.userProfilePic }}
              size={90}
            />
          </View>
          <View style={styles.rightHolder}>
            <View style={styles.userDataContaienr}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profileStats !== null ? profileStats : "0"}
                </Text>
                <Caption style={{ marginTop: -5 }}>Posts</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {averageRating}
                </Text>
                <Caption style={{ marginTop: -5 }}>Rating</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>0</Text>
                <Caption style={{ marginTop: -5 }}>Completed</Caption>
              </View>
            </View>
            <Space space={10} />
            <Button
              mode="contained"
              labelStyle={{ color: "white" }}
              style={{ marginHorizontal: 20 }}
              onPress={() => navigation.navigate("EditProfileScreen")}
            >
              Edit profile
            </Button>
          </View>
        </View>

        <View style={styles.bioholder}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {userData?.userName}
          </Text>
          <Text style={{ fontSize: 16 }}>{userData?.userBio}</Text>
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
    paddingHorizontal: 12,
    justifyContent:'space-between'
  },
  avatarHolder: {
    paddingLeft:5
  },
  rightHolder: {
    flex: 1,
    paddingLeft:5
  },
  userDataContaienr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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


const PostsTaggedScreen = () =>{
    return(
        <BookMarksTab/>
    )
}