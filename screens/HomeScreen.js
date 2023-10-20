import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import { Appbar, MD2Colors } from "react-native-paper";
import { Ionicons, Feather } from "@expo/vector-icons";
import assets from "../assets/assets";
import PostCard from "../components/PostCard";

function HomeScreen({navigation}){
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
          <Appbar.Action
            icon={() => {
              return <Feather name="plus" size={24} color="black" />;
            }}
            onPress={() => setLoading(false)}
          />

          {/* <Appbar.Action
          icon={() => {
            return <Feather name="camera" size={24} color="black" />;
          }}
          onPress={() => navigation.navigate("StoryScreen")}
        /> */}
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
            onPress={() => navigation.navigate("ChatScreen")}
          />
        </Appbar.Header>
        <PostCard />
      </View>
    );}
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});