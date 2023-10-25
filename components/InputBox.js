import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Theme from "../src/Theme";

function InputBox({
  disabled,
  onChangeText,
  value,
  label,
  keyboardType,
  right,
  secureTextEntry,
  left,
  maxLength,
  editable,
  multiline
}) {
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
      disabled={disabled ? disabled : false}
      left={left}
      maxLength={maxLength}
      editable={editable}
      multiline={multiline}
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
