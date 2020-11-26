import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NumberPad(props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>1</Text>
        <Text style={styles.text}>2</Text>
        <Text style={styles.text}>3</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>4</Text>
        <Text style={styles.text}>5</Text>
        <Text style={styles.text}>6</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>7</Text>
        <Text style={styles.text}>8</Text>
        <Text style={styles.text}>9</Text>
      </View>
      <View style={styles.row}>
        <View />
        <Text style={styles.text}>0</Text>
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
  text: {
    fontSize: 36,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
