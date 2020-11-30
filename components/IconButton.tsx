import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function IconButton(props) {
  return (
    <TouchableOpacity
      disabled={!props.enabled}
      onPress={props.enabled && props.onPress}
      style={[styles.container, props.enabled && styles.enabledContainer]}
    >
      <View style={styles.iconContainer}>{props.icon}</View>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "grey",
    minWidth: 210,
    justifyContent: "center",
  },
  enabledContainer: {
    backgroundColor: "black",
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
});
