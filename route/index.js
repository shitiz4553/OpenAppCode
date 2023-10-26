import React,{useEffect, useState} from 'react';
import {StyleSheet,Platform,View, ActivityIndicator} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../src/Theme';
import LandingScreen from '../screens/LandingScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import useStore from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD2Colors } from 'react-native-paper';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PropertyDetailsScreen from '../screens/PropertyDetailsScreen';
import CLStepOne from '../screens/CreateListing/CLStepOne';
import CLStepTwo from '../screens/CreateListing/CLStepTwo';
import PublicProfileViewScreen from '../screens/PublicProfileViewScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


export default function MyStack() {

  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const setUserID = useStore((state) => state.setUserID);
  const userID = useStore((state) => state.userID);
  const [loading,setLoading] = useState(true)  


  const checkLoggedIn = async () => {

    const isLoggedInString = await AsyncStorage.getItem('isLoggedIn');
    const storeUserId = await AsyncStorage.getItem('userID');

    if (isLoggedInString === 'true') {
      setIsLoggedIn(true);
      console.log('Login :',isLoggedIn)
    }

    if (storeUserId !== null ){ 
      setUserID(storeUserId)
      console.log('UID :',storeUserId)
    }

    setLoading(false)
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);



  if(loading){
    return(
      <View style={{flex:1,backgroundColor:'white',justifyContent: 'center',alignItems:'center'}}>
        <ActivityIndicator size={'large'} color={Theme.primaryColor} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false }}>
      {!isLoggedIn ? <Stack.Screen name='LandingScreen' component={LandingScreen} /> : <Stack.Screen name='MainTab' component={MainTab} />}
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PropertyDetailsScreen" component={PropertyDetailsScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="CLStepOne" component={CLStepOne} />
        <Stack.Screen name="CLStepTwo" component={CLStepTwo} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
        <Stack.Screen name="PublicProfileViewScreen" component={PublicProfileViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function MainTab() {
    return (
      <Tab.Navigator
      shifting={true}
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 2,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          backgroundColor: MD2Colors.white,
          paddingBottom: -8,
          height: 65,
          borderRadius: 35,
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size, el, activeColor }) => {
          let iconName;
          //let size;
          if (route.name === "Home") {
            iconName = focused ? "home" : "ios-home-outline";
            size = focused ? 25 : 23;
            // color = "#a2d2ff";
            color = "#000";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person" : "ios-person-outline";
            size = focused ? 25 : 23;
            // color = "#84a59d";
            color = "#000";
          } else if (route.name === "Notification") {
            iconName = focused ? "ios-heart" : "ios-heart-outline";
            size = focused ? 25 : 23;
            // color = "#ffb5a7";
            color = "#000";
          } else if (route.name === "Search") {
            iconName = focused ? "ios-search" : "ios-search-outline";
            size = focused ? 25 : 23;
            // color = "#9a8c98";
            color = "#000";
          } else if (route.name === "AddContainer") {
            iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
            size = focused ? 25 : 23;
            // color = "#9a8c98";
            color = "#000";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={{
                // borderRadius: 50,
                borderBottomWidth: 2,
                borderBottomColor: focused ? color : "#fff",
                padding: 10,
                elevation: el,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
              }}
            />
          );
        },
      })}
    >
        <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen}  />
        <Tab.Screen options={{ headerShown: false }} name="Search" component={SearchScreen}  />
        <Tab.Screen options={{ headerShown: false }} name="Notification" component={NotificationScreen}  />
        <Tab.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen}  />
      </Tab.Navigator>
    );
}

const styles= StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 2,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: MD2Colors.white,
    paddingBottom: -8,
    height: 65,
    borderRadius: 35,
  },
})