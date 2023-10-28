import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { Appbar } from "react-native-paper";
import Typo from "../components/Typo";
import { Ionicons ,AntDesign} from "@expo/vector-icons";
import Theme from "../src/Theme";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import useStore from "../store";

function ChatScreen({ navigation, route }) {
  const { item, otherIDData } = route.params;
  const userID = useStore((state) => state.userID);
  const [chats,setChats] = useState([])
  const [message, setMessage] = useState(""); // State to store the message

  const sendMessage = async () => {
    setMessage("");
    const newMessage = {
      message: message,
      sentBy: userID, // Assuming 'userID' is the sender's ID
      timestamp: new Date().toISOString(), // Use ISO string for consistent timestamp format
    };
  
    // Update the Firestore document
    const convoRef = doc(FB_FIRESTORE, "conversations", item.id);
  
    try {
      // Fetch the existing chats from Firestore
      const convoDoc = await getDoc(convoRef);
  
      if (convoDoc.exists()) {
        const chatData = convoDoc.data();
  
        if (chatData) {
          if (chatData.chats) {
            // Update the chats array with the new message
            chatData.chats.push(newMessage);
          } else {
            // If 'chats' array doesn't exist, create one with the new message
            chatData.chats = [newMessage];
          }
  
          // Update the Firestore document with the updated chats
          await updateDoc(convoRef, {
            chats: chatData.chats,
          });
  
          setMessage(""); // Clear the input field after sending
        }
      }
    } catch (error) {
      console.error("Error updating chat data:", error);
    }
  };

  
useEffect(() => {
  const convoRef = doc(FB_FIRESTORE, "conversations", item.id);

  const unsubscribe = onSnapshot(convoRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const chatData = docSnapshot.data();

      if (chatData && chatData.chats) {
        setChats(chatData.chats);
      }
    }
  });

  return () => {
    // Unsubscribe from the snapshot listener when the component unmounts
    unsubscribe();
  };
}, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
    >
      <View style={{ flex: 1 }} onPress={Keyboard.dismiss}>
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
              <Typo l>
                {otherIDData.length <= 1
                  ? otherIDData[0]?.userName
                  : otherIDData.map((item, index) =>
                      index === otherIDData.length - 1
                        ? item.userName
                        : `${item.userName}, `
                    )}
              </Typo>

              <Typo xs grey>
                Chatting With
              </Typo>
            </View>
            <Appbar.Action
              icon={() => (
                <AntDesign name="star" size={22} color="black" />
              )}
              onPress={() => navigation.navigate("RatingScreen",{
                participants:item.participants,
                otherIDData:otherIDData,
                userID:userID
              })}
            />
          </Appbar.Header>

          <View style={{ flex: 1, padding: 8 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {chats &&
                chats.map((chat, index) => {
                  return (
                    <ChatBubble
                      key={index}
                      message={chat.message}
                      sentBy={chat.sentBy}
                      userID={userID}
                      timestamp={chat.timestamp}
                      otherIDData={otherIDData}
                    />
                  );
                })}
            </ScrollView>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={15} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


// Create a ChatBubble component for displaying messages
function ChatBubble({ message, sentBy, userID, timestamp, otherIDData }) {


  const userObject = otherIDData.find(data => data.userID === sentBy);

  // Check if a matching user object was found and get their profile picture
  const userProfilePic = userObject ? userObject.userProfilePic : null ;
  const userName = userObject ? userObject.userName : null
 
  return (
    <View style={sentBy === userID ? styles.userBubble : styles.otherBubble}>
      <View style={styles.chatContainer}>
        {userProfilePic && (
          <Image
            source={{ uri: userProfilePic }}
            style={styles.profilePic}
          />
        )
        }
        <View style={styles.messageContainer}>
          <Typo s style={{ color: sentBy === userID ? "white" : "black" }}>
            {message}
          </Typo>
          <Typo style={{fontSize:10}} grey>
            {new Date(timestamp).toLocaleTimeString()} {userName ? `- ${userName}` : null}
          </Typo>
        </View>
      </View>
    </View>
  );
}


export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#f0f0f0",
    fontFamily:Theme.PoppinsMedium
  },
  sendButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 15,
    margin: 5,
    maxWidth:'76%'
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    padding: 10,
    borderRadius: 15,
    margin: 5,
    maxWidth:'76%'
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '80%', // Adjust the maximum width as needed
  },
  profilePic:{
    height:25,
    width:25,
    borderRadius:100,
    marginRight:10
  }
});
