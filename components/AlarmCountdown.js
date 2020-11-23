import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import intervalToDuration from "date-fns/intervalToDuration";
import formatDuration from "date-fns/formatDuration";
import isAfter from "date-fns/isAfter";

export default function AlarmCountdown(props) {
  let [now, setNow] = useState(new Date());
  let duration = formatDuration(
    intervalToDuration({ start: new Date(), end: props.date })
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
    <View>
      {isAfter(props.date, new Date()) ? (
        <Text style={styles.text}>Alarm in {duration}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
});
