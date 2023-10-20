import React from "react";
import { 
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert
} from "react-native";

import assets from "../assets/assets";
import Theme from "../src/Theme";
import Typo from "../components/Typo";
import FullButton from "../components/FullButton";
import Space from "../components/Space";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDown from "react-native-paper-dropdown";
import { Banner, TextInput,MD2Colors } from "react-native-paper";
import InputBox from "../components/InputBox";
import FullButtonStroke from "../components/FullButtonStroke";
import { FB_AUTH, FB_FIRESTORE } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import useStore from "../store";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';



function LoginScreen({navigation}){
    const [Password, setPassword] = React.useState("");
    const [securedpassword, setSecuredpassword] = React.useState(true);
    const [Email, setEmail] = React.useState("");
    const [color, setColor] = React.useState("#9d9d9d");
    const [isLoading, setIsLoading] = React.useState(false);
    //SnackBar manage
    const [label, setLabel] = React.useState("");
    const [visible, setVisible] = React.useState(false);

    const setUserID = useStore((state) => state.setUserID);
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

    const eyeColor = () => {
      if (!securedpassword) {
        setColor("#9d9d9d");
      } else {
        setColor("#3d3d3d");
      }
    };


    
    const handleSubmit = async () => {
      if (Email && Password) {
        setIsLoading(true);
        try {
          // Sign up the user with email and password
          const { user } = await signInWithEmailAndPassword(
            FB_AUTH,
            Email,
            Password
          );

          if (user) {
            console.log("Login successful",user.uid);
            await AsyncStorage.setItem("userID", user.uid); 
            await AsyncStorage.setItem("isLoggedIn", "true");
            setIsLoggedIn(true)
            setUserID(user.uid);
          } 
          setUserID(user.uid);
          Alert.alert("Login successful", user.uid);
          navigation.replace("")
        } catch (err) {
          setLabel(err.message);
          setVisible(true);
        }
        setIsLoading(false);
      } else {
        setLabel("Please check all your fields");
        setVisible(true);
      }
    };
    



    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 30, y: 0 }}
          contentContainerStyle={styles.authContainer}
          scrollEnabled={true}
        >
          <View style={styles.logoWrapper}>
            <Image source={assets.logo} style={styles.logo} />
          </View>
          <View style={styles.contentHolder}>
            <InputBox
              keyboardType="email-address"
              label="Email"
              value={Email}
              onChangeText={(text) => setEmail(text)}
            />
            <Space space={5} />
            <InputBox
              label="Password"
              value={Password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={securedpassword}
              right={
                <TextInput.Icon
                  icon={"eye"}
                  size={30}
                  color={color}
                  onPress={() => {
                    setSecuredpassword(!securedpassword);
                    eyeColor();
                  }}
                />
              }
            />
            <Space space={20} />
            <FullButton handlePress={()=>handleSubmit()} label={"Login"} color={Theme.primaryColor} />
            <Space space={15} />
            <TouchableOpacity>
              <Typo s center>
                Don't have an account?
              </Typo>
            </TouchableOpacity>
            <Space space={15} />
            <FullButtonStroke
              handlePress={() => navigation.navigate("SignupScreen")}
              label={"Sign Up"}
              color={Theme.primaryColor}
            />
          </View>

          <Banner
            visible={visible}
            actions={[
              {
                label: "Ok",
                onPress: () => setVisible(false),
              },
            ]}
            contentStyle={{
              backgroundColor: MD2Colors.red100,
              borderRadius: 9,
            }}
            style={{
              margin: 10,
              borderRadius: 9,
              marginBottom: 20,
            }}
          >
            <Typo style={{ fontSize: 15, color: "#000" }}>{label}</Typo>
          </Banner>
        </KeyboardAwareScrollView>
      </View>
    );}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHolder: {
    flex: 2,
    paddingHorizontal: 20,
  },
  logo: {
    height: 225,
    width: 225,
    resizeMode: "contain",
  },
  loginText: {
    fontFamily: Theme.PoppinsBold,
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 50,
  },
  input:{
    width:'100%',
    height:45
  }
});