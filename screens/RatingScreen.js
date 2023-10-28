import React, { useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import Typo from "../components/Typo";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Ionicons ,AntDesign} from "@expo/vector-icons";
import { arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";

function RatingScreen({navigation,route}){

    const {otherIDData,userID,participants} = route.params;
    const [loading,setLoading]= useState(false)

    return (
      <View style={styles.container}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff",
            justifyContent: "space-between",
            borderRadius: 15,
            elevation: 0,
          }}
        >
          <Appbar.Action
            icon={() => (
              <Ionicons
                name="ios-chevron-back-outline"
                size={24}
                color="black"
              />
            )}
            onPress={() => navigation.goBack()}
          />
          <View style={{ alignItems: "center" }}>
            <Typo l>Provide Rating</Typo>

            <Typo xs grey>
              Leave a Feedback
            </Typo>
          </View>
          <Appbar.Action />
        </Appbar.Header>

        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
          {otherIDData &&
            otherIDData.map((item, index) => {
              return (
                <RatingCard
                  userProfilePic={item.userProfilePic}
                  userName={item.userName}
                  key={index}
                  setLoading={setLoading}
                  participants={participants}
                  userID={userID}
                  item={item}
                />
              );
            })}
        </ScrollView>


        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={"white"} size={"large"} />
          </View>
        ) : null}
        

      </View>
    );}
export default RatingScreen;


const RatingCard = ({
  userProfilePic,
  userName,
  userID,
  participants,
  setLoading,
  item
}) => {
  const [rating, setRating] = useState(0); // Initial rating is 0 (no stars selected)
  const [showSubmit,setShowSubmit] = useState(true);

   // Function to handle star rating
   const handleRating = (newRating) => {
    setRating(newRating);
  };

  
  const handleSubmission = async () => {
    setLoading(true);
    if (rating === 0) {
      Alert.alert("Rating Cannot Be Empty.");
    } else {
      // Reference to the user's document
      const userRef = doc(FB_FIRESTORE, "users", item.userID);
  
      try {
        // Get the user's document to check for existing ratings
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const ratings = userData.ratings || [];
  
          // Check if the user has already rated
          const hasRated = ratings.some((r) => r.ratedBy === userID);
  
          if (hasRated) {
            Alert.alert("You have already rated this user.");
          } else {
            // Update the document by adding rating and ratedBy
            await updateDoc(userRef, {
              ratings: arrayUnion({
                rating: rating,
                ratedBy: userID,
              }),
            });
  
            Alert.alert("Rating submitted successfully.");
            setShowSubmit(false)
          }
        } else {
          Alert.alert("User not found.");
        }
      } catch (error) {
        console.error("Error updating the document:", error);
        Alert.alert("Error submitting rating.");
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: userProfilePic }} style={styles.profileImage} />

        <Typo style={styles.userName}>{userName}</Typo>
      </View>

      {/* Star Rating */}
      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <TouchableOpacity
            key={starNumber}
            onPress={() => handleRating(starNumber)}
          >
            <AntDesign
              name={starNumber <= rating ? "star" : "staro"}
              size={25}
              color={starNumber <= rating ? "black" : "gray"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
    {showSubmit === false ? null :  <TouchableOpacity style={styles.submitButton} onPress={handleSubmission}>
        <Typo style={styles.submitText}>Submit</Typo>
      </TouchableOpacity>}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom:15
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 45,
    backgroundColor:'grey',
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft:5
  },
  starRating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  submitText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  loadingOverlay:{
    flex:1,
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0,
    zIndex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  }
});