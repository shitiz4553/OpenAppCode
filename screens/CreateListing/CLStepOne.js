//This page is for clicking or selecting picture to upload

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import {  ActivityIndicator, IconButton,MD2Colors } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import Typo from "../../components/Typo";
import {  FB_STORAGE } from "../../config/firebase";
import {  uploadBytesResumable, getDownloadURL, ref,  } from 'firebase/storage';



const metadata = {
  contentType: 'application/octet-stream'
};



export default function CLStepOne({ navigation }) {

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flesh, setFlesh] = useState(Camera.Constants.FlashMode.off);
  const [image, setImage] = useState("");
  const [loading,setLoading]= useState(null)
  const [uploadedImage, setUploadedImage] = useState("")

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // to add videos as well just alter this line
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.2,
    });
    if (!result.canceled) {
      setImage(result.uri);
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
            setUploadedImage(downloadURL)
            navigation.navigate("CLStepTwo",{image:downloadURL})
            setLoading(false);
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







  const OpenCam = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 4],
      quality: 0.2,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  if (
    hasCameraPermission === false ||
    hasCameraPermission === null ||
    hasGalleryPermission === false
  ) {
    return (
      <View style={[styles.Camcontainer, { paddingHorizontal: 30 }]}>
        <Typo l>
          Camera access is denied. Please Go to settings and turn on the camera
          access.
        </Typo>
      </View>
    );
  }


  const handleImageUpload = async (image) => {

    await uploadImage(image)

  }


  return (
    <View style={styles.container}>
      <View style={styles.Camcontainer}>
        {!image ? (
          <Camera
            flashMode={flesh}
            ref={(ref) => setCamera(ref)}
            style={styles.preview}
            type={type}
            autofocus={Camera.Constants.AutoFocus.on}
            ratio={"4:3"}
          />
        ) : (
          <View style={styles.containerImg}>
            <Image
              source={{ uri: image }}
              style={{ flex: 1, aspectRatio: 3 / 4 }}
            />
            <IconButton
              icon="close"
              color="#fff"
              onPress={() => setImage("")}
              size={30}
              style={{
                position: "absolute",
                right: 5,
                top: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 15,
              }}
            >
              Clear screen
            </IconButton>
          </View>
        )}
      </View>
      {!image ? (
        <TouchableOpacity onPress={takePicture}>
          <FontAwesome
            name="circle-o"
            color={"#3a3a3a"}
            size={80}
            style={styles.button1}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => handleImageUpload(image)}>
          <AntDesign
            name="checkcircle"
            color={"#000"}
            size={65}
            style={styles.button1}
          />
        </TouchableOpacity>
      )}
      <View style={styles.buttonContainer}>
        <IconButton size={30} icon="image" onPress={pickImage} />
        <IconButton size={30} icon="camera" onPress={OpenCam} />
        <IconButton
          size={30}
          icon={flesh ? "flash" : "flash-off"}
          onPress={() => {
            setFlesh(
              flesh === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            );
          }}
        ></IconButton>

        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialIcons
            name={type ? "camera-front" : "camera-rear"}
            color={"#000"}
            size={30}
            style={styles.flipcamera}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{
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
        }}>
          <ActivityIndicator color={"white"} size={"large"} />
        </View>
      ) : null}
    </View>
  );
}



const styles = StyleSheet.create({
  Camcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  containerImg: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    aspectRatio: 3 / 4,
  },
  button1: {
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  flipcamera: {},
  buttonContainer: {
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
    color: "#fff",
    tintColor: "#fff",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  caption: {
    color: "#5f5f5f",
  },
  droidSafeArea: {
    paddingTop: Constants.statusBarHeight,
  },
  topContainer: {
    backgroundColor: "transparent",
    paddingTop: "30%",
  },
  userRaw: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingTop: 10,
    marginBottom: 10,
  },
  userDataContaienr: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  userNameRaw: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  editProfile: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  images: {
    flex: 1,
    marginLeft: 10,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  iconButton: {
    backgroundColor: "white",
    elevation: 10,
    borderColor: "black",
    borderWidth: 0.5,
    marginLeft: -40,
  },
  subHeading: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    marginVertical: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchBarStyle: {
    padding: 0,
    marginHorizontal: 10,
    backgroundColor: "#f000",
    borderBottomColor: "#f000",
    borderTopColor: "#f000",
  },
  searchBarInput: {
    backgroundColor: MD2Colors.grey200,
    height: 40,
    padding: 5,
  },
  userItem: {
    margin: 10,
    borderBottomColor: MD2Colors.grey400,
    borderBottomWidth: 0.5,
  },
  pageSubTitle: {
    fontSize: 25,
    color: MD2Colors.grey600,
    fontWeight: "600",
    marginBottom: 10,
  },
});