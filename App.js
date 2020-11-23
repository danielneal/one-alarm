import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView,StyleSheet, Text, View } from "react-native";
import * as Svg from "react-native-svg";
import Clock from "./components/Clock";
import ClockDigital from "./components/ClockDigital";
import AlarmCountdown from "./components/AlarmCountdown";
import { State, PanGestureHandler } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import add from "date-fns/add";
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'

const alarmStorageKey = "@alarm"
const notificationID = "@alarm"

async function requestPermissionsAsync() {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

requestPermissionsAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function App() {
  const [alarmState, setAlarmState] = useState(null);
  const [handlerState, setHandlerState] = useState();
  const [alarmTimeAtGestureBegin, setAlarmTimeAtGestureBegin] = useState(null);

  const saveAlarmState = async () => {
    if(alarmState!==null) {
      let s = JSON.stringify({...alarmState,time:formatISO(alarmState.time)})
      AsyncStorage.setItem(alarmStorageKey,s)
    }
  }

  const onHandlerStateChange = useCallback(async (e) => {
    if (e.nativeEvent.state === State.BEGAN) {
      setAlarmTimeAtGestureBegin(alarmState.time);
    }

    if (e.nativeEvent.state === State.END && isAfter(alarmState.time,new Date())) {
      await Notifications.cancelScheduledNotificationAsync(notificationID);
      await Notifications.scheduleNotificationAsync({
          identifier: notificationID,
          content: {
            title: "One Alarm",
            subtitle: "It's time.",
            sound: "alarm.wav",
          },
        trigger: alarmState.time
      });
      if(alarmState.enabled === false) {
        setAlarmState((state)=> {
          return {...state, enabled:true}
        })
      }
    }
  })

  const onGestureEvent = useCallback(async (e) => {
    let newTime = add(alarmTimeAtGestureBegin, { minutes: e.nativeEvent.translationY/2 })
    let alarmTime = isAfter(newTime, new Date())
    setAlarmState((state) => {
      return { ...state, time:newTime }
    });
  });

  const onAlarmEnabledChange = useCallback(async (e) => {
    setAlarmState((state) => {
      let newState = { ...state, enabled:!state.enabled }
      return newState
    })
  })

  useEffect(()=>{
    const getAlarmFromStorage = async () => {
      const alarmState = await AsyncStorage.getItem(alarmStorageKey)
      const alarmStateParsed = JSON.parse(alarmState)
      setAlarmState(alarmStateParsed !== null ?
                    { time:parseISO(alarmStateParsed.time),
                      enabled:alarmStateParsed.enabled}
                    : { time:roundToNearestMinutes(new Date()),
                        enabled:false })
    }
    getAlarmFromStorage()
  },[])

  useEffect(()=>{
    saveAlarmState()
  }, [alarmState])

  return (
    <SafeAreaView>
      <PanGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        onGestureEvent={onGestureEvent}>
        <View style={styles.container}>
          { alarmState!==null &&
            <>
              <Clock date={alarmState.time}/>
              <ClockDigital date={alarmState.time}/>
              <AlarmCountdown date={alarmState.time}/>
            </>
          }
        </View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    width:"100%",
    height:"100%",
    alignItems:"center",
    justifyContent:"flex-start"
  }
});
