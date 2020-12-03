import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

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
        <TouchableOpacity style={styles.button} onPress={props.onClear}>
          <Entypo name="squared-cross" size={30} color="black" />
        </TouchableOpacity>
        <NumberButton number="0" onPress={props.onPress} />
        <TouchableOpacity
          style={styles.button}
          disabled={!props.enterEnabled}
          onPress={props.enterEnabled && props.onEnter}
        >
          <MaterialIcons
            name="keyboard-return"
            size={30}
            color={props.enterEnabled ? "black" : "#ddd"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    justifyContent: "space-between",
  },
  button: {
    width: 45,
    height: 45,
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
