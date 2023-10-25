import React, { useState } from "react";
import { 
    View,
    Image,
    StyleSheet,
    Alert
} from "react-native";
import assets from "../../assets/assets";
import { ActivityIndicator, Appbar, Banner, Button, Divider, MD2Colors, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import InputBox from "../../components/InputBox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Typo from "../../components/Typo";
import { TouchableOpacity } from "react-native-gesture-handler";
import Space from "../../components/Space";
import DropDown from "react-native-paper-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FullButton from "../../components/FullButton";
import Theme from "../../src/Theme";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FB_FIRESTORE } from "../../config/firebase";
import useStore from "../../store";


const genderList = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
    {
      label: "Both",
      value: "both",
    },
  ];

const propertyTypeList = [
    {
      label: "HDB",
      value: "hdb",
    },
    {
      label: "CONDO",
      value: "condo",
    },
  ];


function CLStepTwo({navigation,route}){

    const { image } = route.params;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [avlDate,setAvlDate] = useState(new Date());
    const [showDropDown, setShowDropDown] = React.useState(false);
    const [gender, setGender] = React.useState("");
    const [propertyType, setPropertyType] = React.useState("");
    const [showDropDownType, setShowDropDownType] = React.useState("");
    const [propertyLocation, setPropertyLocation] = React.useState("");
    const [nearbyLocation, setNearbyLocation] = React.useState("");
    const [price, setPrice] = React.useState(null);
    const [houseSize, setHouseSize] = React.useState(null);
    const [builtYear, setBuiltYear] = React.useState(null);
    const [rooms, setRooms] = React.useState(null);
    const [bathrooms, setBathrooms] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [propertyName, setPropertyName] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [errorLabel, setErrorLabel] = React.useState("");
    const [loading,setLoading] = useState(false);
    const [propertyImage,setPropertyImage] = useState("");
    const userID = useStore((state) => state.userID);
     


    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
      setAvlDate(date)
      hideDatePicker();
    };


    const handleSubmit = async () => {
        // Convert numeric fields from strings to numbers
        const roomsValue = parseInt(rooms, 10);
        const bathroomsValue = parseInt(bathrooms, 10);
        const priceValue = parseFloat(price);
        const houseSizeValue = parseFloat(houseSize);
    
        // Validate user input
        if (
          !propertyName ||
          !propertyLocation ||
          !nearbyLocation ||
          isNaN(roomsValue) ||
          isNaN(bathroomsValue) ||
          isNaN(priceValue) ||
          isNaN(houseSizeValue) ||
          !builtYear ||
          !gender ||
          !propertyType ||
          !description
        ) {
          setErrorLabel(
            "Please fill in all fields and ensure numeric values are valid."
          );
          setVisible(true);
        } else {
          setLoading(true);
          const propertyRef = collection(FB_FIRESTORE, "properties");

          const propertyData = {
            propertyName: propertyName,
            availability: avlDate.toLocaleDateString(),
            propertyLocation: propertyLocation,
            nearby: nearbyLocation,
            price: priceValue,
            houseSize: houseSizeValue,
            builtDate: builtYear,
            room: roomsValue,
            bathroom: bathroomsValue,
            genderPreference: gender,
            propertyType: propertyType,
            description: description,
            postedBy: userID,
            propertyImage: image,
            sharing: [],
            postedDate: serverTimestamp(),
          };
          const docRef = await addDoc(propertyRef, propertyData);

          // Success message or navigation can go here
          console.log("Document added with ID: ", docRef.id);
          Alert.alert("Posted!", "Your Listing Has been Added Successfully!");
          navigation.navigate("MainTab")
          setLoading(false);
        }
      };











      
    return (
      <View style={styles.container}>
        <Appbar.Header
          style={{
            backgroundColor: "#fff",
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
          <Image source={assets.logo} style={{ height: 25, width: 160 }} />
          <Appbar.Action />
        </Appbar.Header>

        <View style={styles.body}>
          <Space space={15} />
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 30, y: 0 }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoWrapper}>
              <Image source={{ uri: image }} style={styles.boxImage} />
              <View style={styles.infoRight}>
                <InputBox
                  value={propertyName}
                  onChangeText={(text) => setPropertyName(text)}
                  label={"Property Name"}
                />
              </View>
            </View>
            <Divider style={styles.divider} />
            <InputBox
              value={avlDate.toDateString()}
              label={"Availability From"}
              editable={false}
              right={
                <TextInput.Icon
                  icon={"calendar"}
                  size={25}
                  onPress={() => showDatePicker()}
                />
              }
            />
            <Space space={5} />
            <InputBox
              value={propertyLocation}
              onChangeText={(text) => setPropertyLocation(text)}
              label={"Property Location"}
            />
            <Space space={5} />
            <InputBox
              value={nearbyLocation}
              onChangeText={(text) => setNearbyLocation(text)}
              label={"Nearby Location"}
            />
            <Space space={5} />
            <InputBox
              value={price}
              onChangeText={(text) => setPrice(text)}
              keyboardType={"numeric"}
              label={"$ Price / Mo"}
            />
            <Divider style={styles.divider} />
            <InputBox
              left={<TextInput.Icon icon={"home"} size={25} />}
              keyboardType={"numeric"}
              label={"House Size (In Sq Ft.)"}
              value={houseSize}
              onChangeText={(text) => setHouseSize(text)}
            />
            <Space space={5} />
            <InputBox
              left={<TextInput.Icon icon={"calendar"} size={25} />}
              keyboardType={"numeric"}
              label={"Built Year (Eg. 2001)"}
              maxLength={4}
              value={builtYear}
              onChangeText={(text) => setBuiltYear(text)}
            />
            <Space space={5} />
            <InputBox
              left={<TextInput.Icon icon={"bed-king"} size={25} />}
              keyboardType={"numeric"}
              label={"Number Of Rooms"}
              maxLength={2}
              value={rooms}
              onChangeText={(text) => setRooms(text)}
            />
            <Space space={5} />
            <InputBox
              left={<TextInput.Icon icon={"shower"} size={25} />}
              keyboardType={"numeric"}
              label={"Number of Bathrooms"}
              maxLength={2}
              value={bathrooms}
              onChangeText={(text) => setBathrooms(text)}
            />

            <Divider style={styles.divider} />

            <DropDown
              label={"Preferred Gender"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={gender}
              setValue={setGender}
              list={genderList}
            />

            <Space space={10} />

            <DropDown
              label={"Property Type"}
              mode={"outlined"}
              visible={showDropDownType}
              showDropDown={() => setShowDropDownType(true)}
              onDismiss={() => setShowDropDownType(false)}
              value={propertyType}
              setValue={setPropertyType}
              list={propertyTypeList}
            />

            <Divider style={styles.divider} />

            <InputBox
              value={description}
              onChangeText={(text) => setDescription(text)}
              label={"Description"}
              multiline={true}
            />

            <Space space={25} />
            {loading ? null :<FullButton
              handlePress={()=>handleSubmit()}
              color={Theme.primaryColor}
              label={"Create a Post"}
            />}
            <Space space={35} />

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              isDarkModeEnabled={true}
            />
          </KeyboardAwareScrollView>
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
          <Typo style={{ fontSize: 15, color: "#000" }}>{errorLabel}</Typo>
        </Banner>

        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={"white"} size={"large"} />
          </View>
        ) : null}


      </View>
    );}
export default CLStepTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  boxImage: {
    height: 60,
    width: 60,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  infoRight: {
    flex: 1,
  },
  infoWrapper: {
    flexDirection: "row",
    gap: 15,
  },
  pickerBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    height: 50,
    borderRadius: 15,
    marginVertical: 15,
    backgroundColor: "white",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  divider: {
    borderBottomWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
    marginVertical: 15,
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