import React,{useEffect} from 'react';
import {StyleSheet,Platform,Text} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../src/Theme';
import LandingScreen from '../screens/LandingScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const activeIconColor = Theme.primaryColor;
const inactiveIconColor = '#1B0C38';


export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false }}>
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// function MainRoute() {
//     return (
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ focused }) => {
//             let iconSource;
//             let iconColor;

//             switch (route.name) {
//               case "Home":
//                 iconSource = "home-sharp";
//                 break;
//               case "Tools":
//                 iconSource = "md-document-text";
//                 break;
//               case "Profile":
//                 iconSource = "person";
//                 break;
//             }

//             if (focused) {
//               iconColor = activeIconColor;
//             } else {
//               iconColor = inactiveIconColor;
//             }

//             return <Ionicons name={iconSource} size={24} color={iconColor} />;
//           },
//           tabBarStyle: [styles.tabbarstyle],
//           tabBarActiveTintColor: Theme.primaryColor,
//           tabBarInactiveTintColor: "#1B0C38",
//           tabBarLabelStyle:{
//             fontSize:14,
//             padding:0,
//             margin:0,
//             fontFamily:Theme.MulishRegular,
//             marginBottom:Platform.OS=='android' ? 12 : 0
//           }
//         })}
//       >
//         <Tab.Screen
//           options={{ headerShown: false }}
//           name="Home"
//           component={HomeScreen}
//         />
//         <Tab.Screen
//           options={{ headerShown: false }}
//           name="Tools"
//           component={ToolsScreen}
//         />
//         <Tab.Screen
//           options={{ headerShown: false }}
//           name="Profile"
//           component={ProfileScreen}
//         />
//       </Tab.Navigator>
//     );
// }

const styles= StyleSheet.create({
    tabbarstyle:{
    height: Platform.OS === 'ios' ? 95 : 75, // set the height based on the platform
    borderTopWidth: 0.5, // add a border to the top of the tab bar
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF', // set a background color for the tab bar
    paddingVertical: Platform.OS === 'ios' ? 20 : 0 // add extra padding for iOS to account for the notch
    },
})