import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

function ProfileScreen({navigation}){
    return(
    <View style={styles.container}>
        <Text>ProfileScreen</Text>
    </View>
    )}
export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});