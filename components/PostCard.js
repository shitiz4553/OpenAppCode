import React from "react";
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

function PostCard({navigation}){

    const height =  useWindowDimensions().width + 155
    return (
      <Card style={[styles.container, styles.elevation]}>
       <TouchableOpacity style={styles.info}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/47.jpg" }}
            style={styles.avatar}
          />
          <Typo>Avatar</Typo>
        </TouchableOpacity>
        <Space space={10} />
        <Card.Cover
          source={{
            uri: "https://sg1-cdn.pgimgs.com/listing/24679734/UPHO.143750983.V800/Finland-Gardens-East-Coast-Marine-Parade-Singapore.jpg",
          }}
          style={[styles.cardCover,{height:height}]}
        />
        <View style={styles.titleArea}>
          <Typo bold l>Sky @ Eleven</Typo>
        </View>
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
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:15
  }
});