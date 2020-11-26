import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import intervalToDuration from "date-fns/intervalToDuration";
import formatDuration from "date-fns/formatDuration";
import isAfter from "date-fns/isAfter";
import add from "date-fns/add";

export default function AlarmCountdown(props) {
  let [now, setNow] = useState(new Date());
  let duration = formatDuration(
    intervalToDuration({ start: now, end: props.date })
  );
  useEffect(() => {
    let intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {isAfter(props.date, add(now, { seconds: 1 })) ? (
        <Text style={styles.text}>Alarm in {duration}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
