import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import useStore from "../store";
import { doc, getDoc } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import assets from "../assets/assets";

const ConversationCard = ({ item }) => {
  const userID = useStore((state) => state.userID);
  const [loading, setLoading] = useState(true);
  const [otherIDData, setOtherIDData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOtherIDData = async () => {
      const otherID = item.participants.filter(
        (participantID) => participantID !== userID
      );
      console.log(otherID);

      const userDataPromises = otherID.map(async (id) => {
        const userRef = doc(FB_FIRESTORE, "users", id);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          return userSnapshot.data();
        }
        return null; // Return null if the user data doesn't exist
      });

      const otherUserData = await Promise.all(userDataPromises);
      setOtherIDData(otherUserData.filter(Boolean)); // Filter out any null values
      setLoading(false);
    };

    fetchOtherIDData();
  }, [userID]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatScreen", {
          item: item,
          otherIDData: otherIDData,
        })
      }
      style={styles.cardContainer}
    >
      {otherIDData.length <= 1 ? (
        <Image
          source={{ uri: otherIDData[0]?.userProfilePic }}
          style={styles.profilePic}
        />
      ) : (
        <Image source={assets.people} style={styles.profilePic} />
      )}

      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {otherIDData.length <= 1 ? otherIDData[0]?.userName : "Group Chat"}
        </Text>
        <Text style={styles.userEmail}>
          {otherIDData.length <= 1
            ? "Click To Chat"
            : otherIDData.map((item, index) =>
                index === otherIDData.length - 1
                  ? item.userName
                  : `${item.userName}, `
              )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    marginTop: 10,
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#e5e5e5",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#888",
  },
});

const groupChatIcon =
  "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/users.png";
