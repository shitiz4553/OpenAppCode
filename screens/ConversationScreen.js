import React, { useEffect, useState } from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text
} from "react-native";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import assets from "../assets/assets";
import useStore from "../store";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import ConversationCard from "../components/ConversationCard";


function ConversationScreen({navigation}){

    const [conversationData,setConversationData] = useState([])
    const userID = useStore((state) => state.userID);
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const fetchConversations = async () => {
          const conversationRef = collection(FB_FIRESTORE, "conversations");
          const q = query(
            conversationRef,
            where("participants", "array-contains", userID)
          );
    
          try {
            const querySnapshot = await getDocs(q);

            const conversations = [];
            querySnapshot.forEach((doc) => {
              // Access the document data here
              const data = doc.data();
              const id = doc.id;
              conversations.push({ id, ...data });
            });

            // Set the filtered conversations data in the state
            setConversationData(conversations);
            // await fetchParticipantData(conversations);
            setLoading(false)
          } catch (error) {
            console.error("Error fetching conversations:", error);
            setLoading(false)
          }
        };
    
        fetchConversations();
      }, [userID]);



    return (
      <View style={styles.container}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff0",
            justifyContent: "space-between",
            borderRadius: 15,
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

         {
            loading ? 
            <View style={[styles.body,{justifyContent:'center'}]}>
                <ActivityIndicator color="black" />
            </View>
            :
            <View style={styles.body}>
            {conversationData &&
              conversationData.map((item,index) => {
                return <ConversationCard item={item} key={index} />;
              })}
          </View>
         }
     
      </View>
    );}
export default ConversationScreen;




  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
 
});