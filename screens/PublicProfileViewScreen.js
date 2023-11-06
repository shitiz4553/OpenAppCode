import React, { useEffect, useState } from "react";
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
import Space from "../components/Space";

const Tab = createMaterialTopTabNavigator();


function PublicProfileViewScreen({navigation,route}){

  const {user} = route.params;
  const userID = useStore((state) => state.userID);
  const [postCount,setPostCount] = useState(0)


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


  useEffect(() => {
    if (user.userRole !== "user") {
      const propertyRef = collection(FB_FIRESTORE, "properties");
      const queryref = query(propertyRef, where("postedBy", "==", user.userID));
  
      // Create a function to fetch and count the documents
      const fetchAndCountDocuments = async () => {
        try {
          const querySnapshot = await getDocs(queryref);
          const numberOfDocuments = querySnapshot.size;
  
          // Store the number of documents in the state variable
          setPostCount(numberOfDocuments);
        } catch (error) {
          // Handle any errors that may occur during the query
          console.error("Error fetching documents:", error);
        }
      };
  
      fetchAndCountDocuments(); // Call the function to fetch and count the documents
    }
  }, [user.userRole, user.userID]);
 
  const calculateAverageRating = (ratings) => {
    if (ratings && ratings.length > 0) {
      const sumOfRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      return (sumOfRatings / ratings.length).toFixed(1);
    }
    return "0"; // Return "0" as a string when there are no ratings
  };
  
  // Usage:
  const averageRating = calculateAverageRating(user?.ratings);

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
        {/* <View style={styles.contentContainer}>
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
        </View> */}

        <View style={styles.contentContainer}>
          <View style={styles.avatarHolder}>
            <Avatar.Image
              style={{ elevation: 10 }}
              source={{ uri: user?.userProfilePic }}
              size={90}
            />
          </View>
          <View style={styles.rightHolder}>
            <View style={styles.userDataContaienr}>
              {user.userRole !== "user" ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>{postCount}</Text>
                  <Caption style={{ marginTop: -5 }}>Posts</Caption>
                </View>
              ) : null}
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>{averageRating}</Text>
                <Caption style={{ marginTop: -5 }}>Rating</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>0</Text>
                <Caption style={{ marginTop: -5 }}>Completed</Caption>
              </View>
            </View>
            <Space space={10} />
            {
              user.userID !== userID ?
              <Button
              mode="contained"
              labelStyle={{ color: "white" }}
              style={{ marginHorizontal: 20 }}
              onPress={() => handleCreateConversation(userID,user.userID)}
            >
              Send a Message
            </Button>
            :
            null
            }
          </View>
        </View>

        <View style={styles.bioholder}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {user?.userName}
          </Text>
          <Text style={{ fontSize: 16 }}>{user?.userBio}</Text>
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
    paddingLeft:15,
    justifyContent:'space-around',
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
