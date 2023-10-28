import React, { useEffect, useState } from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Alert
} from "react-native";
import { ActivityIndicator, Appbar, Card, Divider, IconButton, MD2Colors, Menu, Paragraph } from "react-native-paper";
import assets from "../assets/assets";
import { Ionicons } from '@expo/vector-icons';
import Typo from "../components/Typo";
import Space from "../components/Space";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FullButton from "../components/FullButton";
import Theme from "../src/Theme";
import { arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import useStore from "../store";
import FullButtonStroke from "../components/FullButtonStroke";

function PropertyDetailsScreen({ navigation, route }) {
  const height = useWindowDimensions().width + 150;
  const { item, av } = route.params;
  const userID = useStore((state) => state.userID);
  const userData = useStore((state) => state.userData);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading,setLoading] = useState(false)
  const [visible, setVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if the item is bookmarked when the component mounts
    if (userData && userData.bookmarks) {
      const isItemBookmarked = userData.bookmarks.includes(item.id);
      setIsBookmarked(isItemBookmarked);
    }
  }, [userData, item]);

  const firestoreTimestamp = item.postedDate;
  const seconds = firestoreTimestamp.seconds;
  const nanoseconds = firestoreTimestamp.nanoseconds;

  const dateObject = new Date(seconds * 1000 + nanoseconds / 1000000);
  const formattedDate = dateObject.toDateString();

  
  const toggleBookMark = async (itemID) => {
    const userRef = doc(FB_FIRESTORE, "users", userID);
    setLoading(true);
    try {
      // First, get the current user document data.
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
  
      // Check if the 'bookmarks' key exists in the user data. If not, create an empty array.
      if (!userData.bookmarks) {
        userData.bookmarks = [];
      }
  
      // Check if the 'itemID' is already in the 'bookmarks' array.
      const index = userData.bookmarks.indexOf(itemID);
  
      if (index === -1) {
        // If 'itemID' is not in the 'bookmarks' array, add it.
        userData.bookmarks.push(itemID);
      } else {
        // If 'itemID' is in the 'bookmarks' array, remove it.
        userData.bookmarks.splice(index, 1);
      }
  
      // Update the user document with the modified 'bookmarks' array.
      await updateDoc(userRef, userData);
      Alert.alert("Bookarks Updated Successfully!")
      setLoading(false);
    } catch (error) {
      console.error("Error toggling item in bookmarks:", error);
      setLoading(false);
    }
  };
  

  const handleAddSharing = async () => {
    const userRef = doc(FB_FIRESTORE, "properties", item.id);
  
    // Check if userID exists in the "sharing" array, and add it if it doesn't exist
    try {
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.sharing.includes(userID)) {
          // userID already exists in the "sharing" array, no need to add it
          console.log('User already in the sharing array');
        } else {
          // Add userID to the "sharing" array
          await updateDoc(userRef, {
            sharing: arrayUnion(userID),
          });
          navigation.navigate("MainTab")
          Alert.alert("You are now enrolled!")
        }
      }
    } catch (error) {
      console.error('Error checking or adding user to sharing array:', error);
    }
  };
  

  const onIconPress = (event) => {
    const { nativeEvent } = event;
    const anchor = {
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    };

    setMenuAnchor(anchor);
    openMenu();
  };

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const handleEdit = () => {
    setVisible(false);
    navigation.navigate("EditPostScreen",{
      item:item
    })
  };


  const handleDelete = async (id) => {
    try {

      const propertyRef = doc(FB_FIRESTORE, "properties", id); 

      await deleteDoc(propertyRef);
  
      Alert.alert("Deleted!", "Your listing has been deleted successfully!");
      navigation.navigate("MainTab");
    } catch (error) {
      // Handle errors if the document couldn't be deleted
      console.error("Error deleting document: ", error);
      // You can display an error message or take other appropriate actions here.
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: MD2Colors.grey200 }}>
      <Appbar.Header
        style={{
          backgroundColor: "#fff0",
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

      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 30, y: 0 }}
        scrollEnabled={true}
      >
        <Card style={[styles.cardWrapper, styles.elevation]}>
          <Menu visible={visible} onDismiss={closeMenu} anchor={menuAnchor}>
            <Menu.Item onPress={() => handleEdit()} title="Edit" />
            <Menu.Item
              onPress={() => {
                Alert.alert(
                  "Delete",
                  "Are you sure to want to delete this post?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        handleDelete(item.id);
                      },
                    },
                  ]
                );
                setVisible(false);
              }}
              title="Delete"
            />
          </Menu>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PublicProfileViewScreen", {
                  user: av,
                })
              }
              style={styles.info}
            >
              <Image
                source={{
                  uri: av?.userProfilePic,
                }}
                style={styles.avatar}
              />
              <Typo>{av?.userName}</Typo>
            </TouchableOpacity>
            {item.postedBy == userID ? (
              <IconButton icon="dots-vertical" onPress={onIconPress} />
            ) : null}
          </View>
          <Space space={10} />
          <View>
            <Card.Cover
              source={{
                uri: item.propertyImage,
              }}
              style={[styles.cardCover, { height: height }]}
            />
          </View>
          <View style={styles.titleArea}>
            <View style={{ width: "80%" }}>
              <Typo style={{ fontSize: 20 }}>{item.propertyName}</Typo>
            </View>
            <TouchableOpacity onPress={() => toggleBookMark(item.id)}>
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <Space space={8} />
          <Typo s light>
            {item.propertyLocation}
          </Typo>
          <Space space={8} />
          <Typo xs light>
            {item.nearby}
          </Typo>
          <Space space={8} />
          <Typo xs light style={{ textTransform: "uppercase" }}>
            {item.propertyType} Built : {item.builtDate}
          </Typo>
          <Space space={8} />
          <Typo xl>${item.price} / mo</Typo>
          <Space space={5} />
          <Typo xs light>
            Available From {item.availability}
          </Typo>

          <Divider
            style={{
              borderBottomWidth: 3,
              borderRadius: 5,
              borderColor: "grey",
              marginTop: 5,
            }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center" }}>
              <IconButton icon={"bed"} size={25} />
              <Typo xs> {item.room} Room</Typo>
            </View>
            <View style={{ alignItems: "center" }}>
              <IconButton icon={"toilet"} size={25} />
              <Typo xs>{item.bathroom} Bathroom</Typo>
            </View>
            <View style={{ alignItems: "center" }}>
              <IconButton icon={"ruler-square"} size={25} />
              <Typo xs>{item.houseSize} sqft</Typo>
            </View>
            <View style={{ alignItems: "center" }}>
              <IconButton icon={"gender-male-female"} size={25} />
              <Typo style={{ textTransform: "capitalize" }} xs>
                {item.genderPreference}
              </Typo>
            </View>
          </View>
          <Divider
            style={{
              borderBottomWidth: 3,
              borderRadius: 5,
              borderColor: "grey",
              marginVertical: 5,
            }}
          />
          <Space space={6} />
          <Typo xl>About this property</Typo>
          <Space space={5} />
          <Typo style={{ lineHeight: 22 }} light grey xs>
            {item.description}
          </Typo>

          <Space space={15} />
          <Divider
            style={{
              borderBottomWidth: 3,
              borderRadius: 5,
              borderColor: "grey",
              marginTop: 5,
            }}
          />
          <Space space={15} />

          <View style={{ flex: 1 }}>
            {item.postedBy === userID || item.sharing.includes(userID) ? (
              <FullButtonStroke
                disabled={true}
                color={Theme.primaryColor}
                label={`Join Sharing Session ${item.sharing.length}/3`}
              />
            ) : (
              <FullButton
                handlePress={() => handleAddSharing()}
                color={Theme.primaryColor}
                label={`Join Sharing Session ${item.sharing.length}/3`}
              />
            )}
          </View>

          <Space space={5} />
          <Typo center xs grey bold>
            This Ad Was Posted on : {formattedDate}
          </Typo>
        </Card>
      </KeyboardAwareScrollView>
      <Space space={25} />

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={"white"} size={"large"} />
        </View>
      ) : null}
    </View>
  );
}
export default PropertyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    borderRadius: 15,
    backgroundColor: "#ffffff",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 100,
    marginRight: 10,
  },
  cardCover: {
    aspectRatio: 4 / 6,
    top: 0,
    justifyContent: "space-around",
    borderRadius: 15,
  },
  titleArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
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