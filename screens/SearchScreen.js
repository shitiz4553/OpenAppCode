import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { Appbar } from "react-native-paper";
import InputBox from "../components/InputBox";
import PostCard from "../components/PostCard";

function SearchScreen({navigation}){
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <View
            style={{
              flex: 1,
              padding: 20,
              marginTop: 20,
            }}
          >
            <InputBox label={"Search"} />
          </View>
        </Appbar.Header>
      </View>
    );}
export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});