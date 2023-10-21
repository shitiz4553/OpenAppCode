import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { Appbar, Avatar, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Typo from "../components/Typo";
import Space from "../components/Space";
import InputBox from "../components/InputBox";
import FullButton from "../components/FullButton";
import Theme from "../src/Theme";

function EditProfileScreen({navigation}){
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
          <Appbar.Action icon="logout" />
        </Appbar.Header>

        <View style={styles.userRaw}>
          <Avatar.Image
            size={150}
            source={{ uri: "https://randomuser.me/api/portraits/men/30.jpg" }}
          />
          <IconButton
            icon="pencil"
            animated={true}
            style={styles.iconButton}
            size={22}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Typo>Personal Information</Typo>
          <Space space={5} />
          <InputBox label={"Name"} />
          <Space space={5} />
          <InputBox label={"Email"} />
          <Space space={5} />
          <InputBox label={"Bio"} />
          <Space space={25} />
          <FullButton color={Theme.primaryColor}  label={'Update'}/>
        </View>
      </View>
    );}
export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  userRaw: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingTop: 10,
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: "white",
    elevation: 10,
    borderColor: "black",
    borderWidth: 0.5,
    marginLeft: -40,
  },
});