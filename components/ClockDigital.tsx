import React from "react";
import { StyleSheet, Text, View } from "react-native";

function formatTimePart(n) {
  return n.toString().padStart(2, "0");
}

export default function ClockDigital(props) {
  let hours = formatTimePart(props.date.getHours());
  let minutes = formatTimePart(props.date.getMinutes());
  //override hours / minutes if we are entering text
  if (props.timeText !== null) {
    hours = props.timeText.slice(-4, -2).padStart(2, "0");
    minutes = props.timeText.slice(-2).padStart(2, "0");
  }
  return (
    <View style={styles.container}>
      <View style={styles.digitsView}>
        <Text
          style={[
            styles.text,
            styles.hourText,
            !props.validTimeText && styles.invalidText,
          ]}
        >
          {hours}
        </Text>
      </View>
      <Text style={[styles.text, !props.validTimeText && styles.invalidText]}>
        :
      </Text>
      <View style={styles.digitsView}>
        <Text
          style={[
            styles.text,
            styles.minuteText,
            !props.validTimeText && styles.invalidText,
          ]}
        >
          {minutes}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  digitsView: {
    flex: 1,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
  },
  hourText: {
    textAlign: "right",
  },
  minuteText: {
    textAlign: "left",
  },
  invalidText: {
    color: "#AAA",
  },
});
