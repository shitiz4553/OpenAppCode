import React, { useEffect, useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { Appbar, MD2Colors } from "react-native-paper";
import { Ionicons, Feather } from "@expo/vector-icons";
import assets from "../assets/assets";
import PostCard from "../components/PostCard";
import Space from "../components/Space";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import useStore from "../store";

function HomeScreen({navigation}){

  const setUserData = useStore((state) => state.setUserData);
  const userData = useStore((state) => state.userData);
  const userID = useStore((state) => state.userID);
  const setPropertyData = useStore((state) => state.setPropertyData);
  const propertyData = useStore((state) => state.propertyData);
  const setProfileStats = useStore((state) => state.setProfileStats);
  const [loading,setLoading] = useState(true)


  useEffect(() => {
    fetchData();
    fetchDataProperty();
  }, [userID]);
  
  const fetchData = async () => {
    const docRef = doc(FB_FIRESTORE, "users", userID);
  
    try {
      // Set up a real-time listener using onSnapshot
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserData(data);
          console.log("Loaded user data...")
        } else {
          console.log("Document does not exist!");
        }
      });
  
      setLoading(false); // This line is executed immediately, not after the listener is set up.
  
    } catch (error) {
      console.error("Error fetching document:", error);
      setLoading(false);
    }
  };
  


  const fetchDataProperty = () => {
    setLoading(true);
    const docRef = collection(FB_FIRESTORE, "properties");
  
    try {
      // Set up a real-time listener using onSnapshot
      onSnapshot(docRef, (querySnapshot) => {
        const propertiesArray = [];
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Include the document ID in the data
          data.id = doc.id;
          propertiesArray.push(data);
        });
  
        // Now, propertiesArray contains all documents with their IDs
        console.log(propertiesArray); // This will log the array of properties with IDs
        setPropertyData(propertiesArray);
  
        // Call the function with propertyData and userID
        filterAndLogPosts(propertiesArray, userID);
  
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    filterAndLogPosts(propertyData, userID);
  }, [propertyData, userID]);
  
  function filterAndLogPosts(propertyData, userID) {
    if (propertyData && Array.isArray(propertyData)) {
      const userPosts = propertyData.filter(item => item.postedBy === userID);
      console.log(`Total posts by user ${userID}: ${userPosts.length}`);
      setProfileStats(userPosts.length)
    } else {
      console.log("propertyData is not available or not an array.");
    }
  }

 

  const filterPropertyData = () => {
    if (propertyData && Array.isArray(propertyData)) {
      // Use the filter method to get items with sharing array less than 3
      const filteredData = propertyData.filter((item) => item.sharing.length < 3);
      return filteredData;
    }
    return [];
  };


    return (
      <View style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff0",
            justifyContent: "space-between",
            borderRadius: 15,
            elevation: 0,
          }}
        >
          {userData?.userRole === "agent" || userData?.userRole ==="admin" ? (
            <Appbar.Action
              icon={() => {
                return <Feather name="plus" size={24} color="black" />;
              }}
              onPress={() => navigation.navigate("CLStepOne")}
            />
          ) : (
            <Appbar.Action />
          )}
          <Image source={assets.logo} style={{ height: 25, width: 160 }} />
          <Appbar.Action
            icon={() => {
              return (
                <Ionicons
                  name="ios-chatbox-ellipses-outline"
                  size={24}
                  color="black"
                />
              );
            }}
            onPress={() => navigation.navigate("ConversationScreen")}
          />
        </Appbar.Header>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
             {propertyData &&
            filterPropertyData().map((item, index) => {
              return (
                <PostCard key={index} postedBy={item.postedBy} item={item} />
              );
            })}
            <Space space={100} />
          </ScrollView>
        )}
      </View>
    );}
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});