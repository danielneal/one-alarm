import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import intervalToDuration from 'date-fns/intervalToDuration'
import formatDuration from 'date-fns/formatDuration'
import isAfter from 'date-fns/isAfter'

export default function AlarmCountdown(props) {
  let duration = formatDuration(intervalToDuration({start:new Date(),end:props.date}))
  return (
    <View>
      {isAfter(props.date, new Date()) ?
       <Text style={styles.text}>{duration}</Text>
       :null}
    </View>)
}

const styles = StyleSheet.create({
  text: {
    fontSize:20
  }
})
