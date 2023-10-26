import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { FB_FIRESTORE } from "../config/firebase";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import useStore from "../store";
import { useNavigation } from "@react-navigation/native";

function BookMarksTab() {
  const userID = useStore((state) => state.userID);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const setPropertyData = useStore((state) => state.setPropertyData);
  const propertyData = useStore((state) => state.propertyData);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Check if propertyData is null or empty before fetching new data
    if (!propertyData || propertyData.length === 0) {
      fetchDataProperty();
    }
    if (!userData || userData.length === 0){
        fetchData();
    }
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

  const filterPropertiesByBookmarks = (properties, bookmarks) => {
    if (bookmarks && bookmarks.length > 0) {
      return properties.filter((property) => bookmarks.includes(property.id));
    }
    return [];
  };


  const bookmarkedProperties = filterPropertiesByBookmarks(
    propertyData,
    userData?.bookmarks
  );


  return (
    <View style={styles.container}>
      {loading && bookmarkedProperties !== null ? (
        <ActivityIndicator color={"black"} />
      ) : (
        <FlatList
          data={bookmarkedProperties}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

export default BookMarksTab;

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
