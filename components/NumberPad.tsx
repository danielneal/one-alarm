import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

function NumberButton(props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => props.onPress(props.number)}
    >
      <Text style={styles.text}>{props.number}</Text>
    </TouchableOpacity>
  );
}
export default function NumberPad(props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <NumberButton number="1" onPress={props.onPress} />
        <NumberButton number="2" onPress={props.onPress} />
        <NumberButton number="3" onPress={props.onPress} />
      </View>
      <View style={styles.row}>
        <NumberButton number="4" onPress={props.onPress} />
        <NumberButton number="5" onPress={props.onPress} />
        <NumberButton number="6" onPress={props.onPress} />
      </View>
      <View style={styles.row}>
        <NumberButton number="7" onPress={props.onPress} />
        <NumberButton number="8" onPress={props.onPress} />
        <NumberButton number="9" onPress={props.onPress} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={props.onClear}>
          <Entypo name="squared-cross" size={30} color="black" />
        </TouchableOpacity>
        <NumberButton number="0" onPress={props.onPress} />
        <View />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 30,
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
