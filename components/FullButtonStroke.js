import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Theme from "../src/Theme";

function FullButtonStroke({color,label,handlePress,disabled}){
    return (
      <TouchableOpacity
        disabled={disabled ? disabled : false}
        onPress={handlePress}
        style={[styles.container, { borderWidth: 1, borderColor: color }]}
      >
        <Text style={[styles.text, { color: color }]}>{label}</Text>
      </TouchableOpacity>
    );}
export default FullButtonStroke;

const styles = StyleSheet.create({
    container: {
        height:50,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100
    },
    text:{
        fontSize:14,
        fontFamily:Theme.PoppinsMedium,
    }
});