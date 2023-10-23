import React, { useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator
} from "react-native";
import { Appbar, Avatar, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Typo from "../components/Typo";
import Space from "../components/Space";
import InputBox from "../components/InputBox";
import FullButton from "../components/FullButton";
import Theme from "../src/Theme";
import useStore from "../store";
import {  doc, updateDoc } from "firebase/firestore";
import {FB_FIRESTORE, FB_STORAGE } from "../config/firebase";
import {  uploadBytesResumable, getDownloadURL, ref, deleteObject,  } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';


const metadata = {
  contentType: 'application/octet-stream'
};


function EditProfileScreen({navigation}){

  const userData = useStore((state) => state.userData);
  const userID = useStore((state) => state.userID);
  const [name,setName] = useState(userData?.userName)
  const [bio,setBio] = useState(userData?.userBio)
  const [loading,setLoading] = useState(false);


  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert(
          "Permission Denied",
          "You need to grant permission to access the gallery."
        );
        return;
      }

      const imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (imageResult.canceled) {
        return;
      }

      const imguri = imageResult.assets[0];
      console.log("Uploading the image....");
      await uploadImage(imguri.uri);
    } catch (error) {
      console.log("Image selection error:", error);
      alert("Failed to select image");
    }
  };

  const uploadImage = async (imageUri) => {
    setLoading(true);
    try {
      const storageRef = ref(FB_STORAGE, "images/" + Date.now());
      const img = await fetch(imageUri);
      const blob = await img.blob();
  
      console.log("Uploading image");
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed', (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        setLoading(false);
        switch (error.code) {
          case 'storage/unauthorized':
            console.log("User doesn't have permission to access the object");
            break;
          case 'storage/canceled':
            console.log("User canceled the upload");
            break;
          case 'storage/unknown':
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
        alert(error.message); // Display the error message to the user
      }, () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log('File available at', downloadURL);
            const updateref = doc(FB_FIRESTORE,"users",userID)
            
            const updatedPic = {
              userProfilePic:downloadURL
            }
            updateDoc(updateref,updatedPic)
            setLoading(false);
            Alert.alert("Done!", "Your image has been uploaded successfully");
          })
          .catch((error) => {
            setLoading(false);
            console.log("Error getting download URL:", error);
            alert(error.message); // Display the error message to the user
          });
      });
    } catch (error) {
      console.log("Image upload error:", error);
      alert(error.message); // Display the error message to the user
      setLoading(false);
    }
  };





  const handleUpdate = async () => {
    if(name && bio){
      const userRef = doc(FB_FIRESTORE,"users",userID)

      const updatedData = {
        userBio: bio,
        userName:name
      }

      await updateDoc(userRef, updatedData);
      Alert.alert("Profile Updated Successfully!")
    }
    else{
      Alert.alert("Cannot update Empty Values")
    }
  }




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
        </Appbar.Header>

        <View style={styles.userRaw}>
          <Avatar.Image size={150} source={{ uri: userData?.userProfilePic }} />
          <IconButton
            icon="pencil"
            animated={true}
            style={styles.iconButton}
            size={22}
            onPress={()=>pickImage()}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Typo>Personal Information</Typo>
          <Typo s light grey>
            {userData?.userEmail}
          </Typo>
          <Space space={15} />
          <InputBox
            onChangeText={(text) => setName(text)}
            value={name}
            label={"Name"}
          />
          <Space space={5} />
          <InputBox
            onChangeText={(text) => setBio(text)}
            value={bio}
            label={"Bio"}
          />
          <Space space={25} />
          <FullButton
            handlePress={() => handleUpdate()}
            color={Theme.primaryColor}
            label={"Update"}
          />
        </View>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={"white"} size={"large"} />
          </View>
        ) : null}
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