import React, { useEffect, useState } from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions
} from "react-native";
import { Card } from "react-native-paper";
import Typo from "./Typo";
import Space from "./Space";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";

function PostCard({postedBy,item}){

  const navigation = useNavigation();
  const [av,setAv] = useState(null)
  const height =  useWindowDimensions().width + 145
  const [loading,setLoading] = useState(null)

    useEffect(() => {
      if(postedBy){
        fetchData();
      }
    }, [postedBy]);


    const firestoreTimestamp = item.postedDate;
    const seconds = firestoreTimestamp.seconds;
    const nanoseconds = firestoreTimestamp.nanoseconds;
    
    const dateObject = new Date(seconds * 1000 + nanoseconds / 1000000); 
    const formattedDate = dateObject.toDateString();

    const fetchData = async () => {
      const docRef = doc(FB_FIRESTORE, "users", postedBy);
    
      try {
        // Set up a real-time listener
        onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setAv(data);
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


    return (
      <Card style={[styles.container, styles.elevation]}>
        <TouchableOpacity style={styles.info}>
          <Image
            source={{ uri: av?.userProfilePic }}
            style={styles.avatar}
          />
          <Typo>{av?.userName}</Typo>
        </TouchableOpacity>
        <Space space={10} />
        <TouchableOpacity
          onPress={() => navigation.navigate("PropertyDetailsScreen",{
            item:item,
            av:av,
            formattedDate:formattedDate
          })}
        >
          <Card.Cover
            source={{
              uri: item.propertyImage,
            }}
            style={[styles.cardCover, { height: height }]}
          />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <View style={{ width: "80%" }}>
            <Typo style={{ fontSize: 20 }}>{item.propertyName}</Typo>
          </View>
          <TouchableOpacity>
            <Ionicons name="bookmark" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Space space={8} />
        <Typo s light>
        {item.propertyLocation}
        </Typo>
        <Space space={8} />
        <Typo xs grey>
          {item.availability}
        </Typo>
        <Space space={8} />
        <Typo l>${item.price} / mo</Typo>
        <Space space={5} />

        <View style={[styles.titleArea, { marginTop: 0 }]}>
          <Typo xs light>
            {item.propertyType} Built : {item.builtDate}
          </Typo>
          <Typo xs light>
            Sharing : {item.sharing.length}/3
          </Typo>
        </View>
        <Space space={5} />
        <Typo xs grey bold>
          Posted: {formattedDate ? formattedDate : null}
        </Typo>
      </Card>
    );}
export default PostCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: "#ffffff",
    margin: 4,
    alignItems: "center", justifyContent: "center" ,
    padding:10
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft:5,
    width:'100%',
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
  titleArea:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:15,
  }
});