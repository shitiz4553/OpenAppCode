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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons,MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import PublicPostsTab from "../components/PublicPostsTab";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import useStore from "../store";

const Tab = createMaterialTopTabNavigator();


function PublicProfileViewScreen({navigation,route}){

  const {user} = route.params;
  const userID = useStore((state) => state.userID);

  const handleCreateConversation = async (userID, otherUserID) => {
    const conversationsRef = collection(FB_FIRESTORE, "conversations");
  
    const conversationsQuery = query(conversationsRef, where("participants", "array-contains", userID));
    const conversationsSnapshot = await getDocs(conversationsQuery);
  
    let existingConversationID = null;
  
    conversationsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(otherUserID)) {
        existingConversationID = doc.id;
      }
    });
  
    if (existingConversationID) {
    navigation.navigate("ConversationScreen")
    } else {
      // If no existing conversation is found, create a new conversation
      const newConversationRef = await addDoc(conversationsRef, {
        participants: [userID, otherUserID],
      });
  
      const newConversationID = newConversationRef.id;
      navigation.navigate("ConversationScreen")
      console.log("Created a new conversation with the id",newConversationID)
    }
  };


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
          {user.userID === userID ? (
            <Appbar.Action />
          ) : (
            <Appbar.Action
              icon={() => {
                return (
                  <MaterialCommunityIcons
                    name="message-plus-outline"
                    size={24}
                    color="black"
                  />
                );
              }}
              onPress={() => handleCreateConversation(userID, user.userID)}
            />
          )}
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
            initialParams={{ user: user }}
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



const PostsScreen = ({ route }) => {
  const { user } = route.params;
    return(
      <PublicPostsTab userID={user.userID}/>
    )
}
