import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet,Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import assets from "../assets/assets";
import InputBox from "../components/InputBox";
import { collection, getDocs } from "firebase/firestore";
import { FB_FIRESTORE } from "../config/firebase";
import Space from "../components/Space";
import { FlatList } from "react-native-gesture-handler";
import Theme from "../src/Theme";
import { useNavigation } from "@react-navigation/native";

function SearchScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = async () => {
    const docRef = collection(FB_FIRESTORE, "users");

    try {
      setLoading(true);
      const querySnapshot = await getDocs(docRef); // Fetch the data

      const usersData = [];
      querySnapshot.forEach((doc) => {
        // Iterate through the documents and extract data
        usersData.push(doc.data());
      });

      setUsers(usersData); // Store the data in the state
      setLoading(false);
      filterUsers(searchText);
    } catch (error) {
      console.error("Error fetching document:", error);
      setLoading(false);
    }
  };


  const filterUsers = (text) => {
    const filtered = users.filter(
      (user) =>
        user.userName.toLowerCase().includes(text.toLowerCase()) ||
        user.userEmail.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    filterUsers(text);
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
        <Appbar.Action />
        <Image source={assets.logo} style={{ height: 25, width: 160 }} />
        <Appbar.Action />
      </Appbar.Header>

      <View style={styles.body}>
        <InputBox
          label={"Search"}
          value={searchText}
          onChangeText={handleSearchTextChange}
          placeholder="Search by name or email"
        />

        <Space space={15} />

        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator color={Theme.primaryColor} />
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <UserCard key={index} user={item} />
            )}
          />
        )}
      </View>
    </View>
  );
}


export default SearchScreen;




const UserCard = ({ user }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={()=>navigation.navigate("PublicProfileViewScreen",{
      user:user
    })} style={styles.cardContainer}>
      <Image source={{ uri: user.userProfilePic }} style={styles.profilePic} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.userName}</Text>
        <Text style={styles.userEmail}>{user.userEmail}</Text>
      </View>
    </TouchableOpacity>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    width:'100%',
    backgroundColor:'white',
    borderRadius:15
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor:'#e5e5e5'
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#888",
  },
});
