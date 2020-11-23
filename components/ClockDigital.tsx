import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

function formatTimePart(n) {
  return n.toString().padStart(2,"0")
}

export default function ClockDigital(props) {
  return (
    <View style={styles.container}>
      <View style={styles.digitsView}>
        <Text style={[styles.text,styles.hourText]}>
          {formatTimePart(props.date.getHours())}
        </Text>
      </View>
      <Text style={styles.text}>:</Text>
      <View style={styles.digitsView}>
        <Text style={[styles.text,styles.minuteText]}>
          {formatTimePart(props.date.getMinutes())}
        </Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
    alignItems:"center",
  },
  digitsView: {
    flex:1
  },
  text: {
    fontSize:36,
    fontWeight:"bold"
  },
  hourText: {
    textAlign:"right",
  },
  minuteText: {
    textAlign:"left",
  }
})
