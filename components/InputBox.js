import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Theme from "../src/Theme";

function InputBox({ onChangeText, value,label,keyboardType ,right,secureTextEntry}) {
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      mode="outlined"
      selectionColor="black"
      activeOutlineColor="black"
      style={styles.container}
      label={label}
      keyboardType={keyboardType}
      right={right}
      secureTextEntry={secureTextEntry}
    />
  );
}
export default InputBox;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 15,
    textTransform: "lowercase",
  },
});
