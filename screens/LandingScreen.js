import React from "react";
import { 
    View,
    Image,
    StyleSheet,
    Text
} from "react-native";

import assets from "../assets/assets";
import Theme from "../src/Theme";
import Typo from "../components/Typo";
import FullButton from "../components/FullButton";
import Space from "../components/Space";


function LandingScreen({navigation}){
    return(
    <View style={styles.container}>
     <View style={styles.logoWrapper}>
    <Image source={assets.logo} style={styles.logo}/>
     </View>
     <View style={styles.contentHolder}>
     <Typo s>Already have an account?</Typo>
     <Space space={10}/>
     <FullButton handlePress={()=>navigation.replace("LoginScreen")} label={'Login'} color={Theme.primaryColor} />
     <Space space={15}/>
     <Typo> OR </Typo>
     <Space space={15}/>
     <FullButton handlePress={()=>navigation.replace("SignupScreen")} label={'Sign Up'} color={Theme.primaryColor} />
     </View>
    </View>
    )}
export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrapper: {
    flex: 1.8,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHolder: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal:20
  },
  logo: {
    height: 225,
    width: 225,
    resizeMode: "contain",
  },
  loginText:{
    fontFamily:Theme.PoppinsBold
  }
});