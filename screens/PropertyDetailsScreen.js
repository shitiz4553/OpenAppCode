import React from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions
} from "react-native";
import { Appbar, Card, Divider, IconButton, MD2Colors, Paragraph } from "react-native-paper";
import assets from "../assets/assets";
import { Ionicons } from '@expo/vector-icons';
import Typo from "../components/Typo";
import Space from "../components/Space";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FullButton from "../components/FullButton";
import Theme from "../src/Theme";

function PropertyDetailsScreen({navigation,route}){


    const height =  useWindowDimensions().width + 150
    const {item,av,formattedDate} = route.params


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
            <View style={styles.info}>
              <Image
                source={{
                  uri: av?.userProfilePic,
                }}
                style={styles.avatar}
              />
              <Typo>{av?.userName}</Typo>
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
              <TouchableOpacity>
                <Ionicons name="bookmark" size={24} color="black" />
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
            <Typo xs light style={{textTransform:'uppercase'}}>
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
                <Typo style={{textTransform:'capitalize'}} xs>{item.genderPreference}</Typo>
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
              <FullButton
                color={Theme.primaryColor}
                label={`Join Sharing Session ${item.sharing.length}/3`}
              />
            </View>

            <Space space={5} />
            <Typo center xs grey bold>
              This Ad Was Posted on : {formattedDate}
            </Typo>
          </Card>
        </KeyboardAwareScrollView>
        <Space space={25} />
      </View>
    );}
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
    width: "100%",
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
});