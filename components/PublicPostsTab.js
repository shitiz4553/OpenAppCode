import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { FB_FIRESTORE } from "../config/firebase";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import useStore from "../store";
import { useNavigation } from "@react-navigation/native";

function PublicPostsTab({userID}) {

  const setPropertyData = useStore((state) => state.setPropertyData);
  const propertyData = useStore((state) => state.propertyData);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Check if propertyData is null or empty before fetching new data
    if (!propertyData || propertyData.length === 0) {
      fetchDataProperty();
    }
    fetchData()
  }, [userID]);

  const fetchDataProperty = async () => {
    setLoading(true);
    const docRef = collection(FB_FIRESTORE, "properties");
    const querySnapshot = await getDocs(docRef);

    const propertiesArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Include the document ID in the data
      data.id = doc.id;
      propertiesArray.push(data);
    });

    setPropertyData(propertiesArray);
    setLoading(false);

  };



  const fetchData = async () => {

    const docRef = doc(FB_FIRESTORE, "users", userID);

    try {
      // Set up a real-time listener
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserData(data);
          console.log(data);
        } else {
          console.log("Document does not exist!");
        }
      });

      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching document:", error);
      setLoading(false);
    }
  };

//   const firestoreTimestamp = item.postedDate;
//   const seconds = firestoreTimestamp.seconds;
//   const nanoseconds = firestoreTimestamp.nanoseconds;
  
//   const dateObject = new Date(seconds * 1000 + nanoseconds / 1000000); 
//   const formattedDate = dateObject.toDateString();


  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PropertyDetailsScreen", {
          item: item,
          av: userData,
          //formattedDate: formattedDate,
        })
      }
      style={styles.gridItem}
    >
      <Image source={{ uri: item.propertyImage }} style={styles.image} />
    </TouchableOpacity>
  );


  const filterPropertyData = (data, userID) => {
    return data ? data.filter(item => item.postedBy === userID) : [];
  };

  const filteredPropertyData = filterPropertyData(propertyData, userID);

  return (
    <View style={styles.container}>
      {loading && filteredPropertyData !== null ? (
        <ActivityIndicator color={"black"} />
      ) : (
        <FlatList
          data={filteredPropertyData}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

export default PublicPostsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    backgroundColor:'#e5e5e5'
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
});
