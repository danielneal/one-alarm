import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Svg from 'react-native-svg';
import Clock from './components/Clock'
import { State, PanGestureHandler } from 'react-native-gesture-handler'
import add from 'date-fns/add'

export default function App() {
    const [alarm,setAlarm]=useState(new Date())
    const [handlerState,setHandlerState]=useState()
    const [alarmAtGestureBegin, setAlarmAtGestureBegin]=useState(alarm)
    const onHandlerStateChange=useCallback((e)=>{
        if(e.nativeEvent.state===State.BEGAN) {
            setAlarmAtGestureBegin(alarm)
        }
    })
    const onGestureEvent=useCallback((e)=>{
        setAlarm(add(alarmAtGestureBegin,{minutes:e.nativeEvent.translationY}))
    })
    return (
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange} onGestureEvent={onGestureEvent}>
          <View style={styles.container}>
            <Clock date={alarm}/>
          </View>
        </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
