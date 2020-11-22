import React, { useState } from "react";
import { View, Switch, Text, StyleSheet } from "react-native";

export default AlarmEnabled = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Alarm enabled?</Text>
      <Switch trackColor={{true:"red",
                           false:"gray"}}
              value={props.enabled}
              onChange={props.onChange}/>
    </View>)
}

const styles = StyleSheet.create( {
  container:{
    width:"100%",
    padding:16,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  text:{
    fontSize:20
  }
})
