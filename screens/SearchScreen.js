import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

function SearchScreen({navigation}){
    return(
    <View style={styles.container}>
        <Text>SearchScreen</Text>
    </View>
    )}
export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});