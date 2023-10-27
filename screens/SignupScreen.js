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
import { createUserWithEmailAndPassword } from "firebase/auth";

const genderList = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
  ];

function SignupScreen({navigation}){
    const [showDropDown, setShowDropDown] = React.useState(false);
    const [gender, setGender] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const [Name, setName] = React.useState("");
    const [securedpassword, setSecuredpassword] = React.useState(true);
    const [Email, setEmail] = React.useState("");
    const [color, setColor] = React.useState("#9d9d9d");
    const [isLoading, setIsLoading] = React.useState(false);
    //SnackBar manage
    const [label, setLabel] = React.useState("");
    const [visible, setVisible] = React.useState(false);

    const setUserID = useStore((state) => state.setUserID);

    const eyeColor = () => {
      if (!securedpassword) {
        setColor("#9d9d9d");
      } else {
        setColor("#3d3d3d");
      }
    };

    const handleSubmit = async () => {
      if (Email && Password && Name && gender) {
        setIsLoading(true);
        try {
          // Sign up the user with email and password
          const { user } = await createUserWithEmailAndPassword(
            FB_AUTH,
            Email,
            Password
          );

          const usersRef = collection(FB_FIRESTORE, "users");
          const userID = user.uid;
          const userRole = "user";
          const userName = Name 
          const userEmail = Email.toLowerCase()
          const rating = 0
          const userProfilePic = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          const userDoc = {
            userName,
            userEmail,
            userID,
            rating,
            userProfilePic,
            userRole,
          };

          await setDoc(doc(usersRef, user.uid), userDoc);
          setUserID(user.uid);
          Alert.alert(
            "Account Created Successfully",
            "Please Login with your credentials."
          );
          navigation.navigate("LoginScreen")
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
            <DropDown
              label={"Gender"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={gender}
              setValue={setGender}
              list={genderList}
            />
            <Space space={5} />
            <InputBox
              label={"Name"}
              value={Name}
              onChangeText={(text) => setName(text)}
            />
            <Space space={5} />
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
            <Space space={25} />
            <FullButton handlePress={()=>handleSubmit()} label={"Sign up"} color={Theme.primaryColor} />
            <Space space={15} />
            <TouchableOpacity>
              <Typo s center>
                Already have an account?
              </Typo>
            </TouchableOpacity>
            <Space space={15} />
            <FullButtonStroke
              handlePress={() => navigation.navigate("LoginScreen")}
              label={"Login"}
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

        {isLoading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={"white"} size={"large"} />
          </View>
        ) : null}
      </View>
    );}
export default SignupScreen;

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