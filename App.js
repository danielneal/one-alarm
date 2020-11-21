import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView,StyleSheet, Text, View } from "react-native";
import * as Svg from "react-native-svg";
import Clock from "./components/Clock";
import ClockDigital from "./components/ClockDigital";
import { State, PanGestureHandler } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import add from "date-fns/add";
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
  const [alarm, setAlarm] = useState(null);
  const [handlerState, setHandlerState] = useState();
  const [alarmAtGestureBegin, setAlarmAtGestureBegin] = useState(alarm);

  const onHandlerStateChange = useCallback(async (e) => {
    if (e.nativeEvent.state === State.BEGAN) {
      setAlarmAtGestureBegin(alarm);
    }

    if (e.nativeEvent.state === State.END) {
      await Notifications.cancelScheduledNotificationAsync(notificationID);
      await Notifications.scheduleNotificationAsync({
        identifier: notificationID,
        content: {
          title: "One Alarm",
          subtitle: "It's time.",
          sound: "alarm.wav",
        },
        trigger: {
          hours: alarm.getHours(),
          minutes: alarm.getMinutes(),
          repeat: true
        },
      });

      await AsyncStorage.setItem(alarmStorageKey,formatISO(alarm))
    }
  });

  const onGestureEvent = useCallback(async (e) => {
    setAlarm(add(alarmAtGestureBegin, { minutes: e.nativeEvent.translationY/2 }));
  });

  useEffect(()=>{
    const getAlarmFromStorage = async ()=> {
      const dateStr = await AsyncStorage.getItem(alarmStorageKey)
      const date = dateStr !== null ? parseISO(dateStr) : roundToNearestMinutes(new Date())
      setAlarm(date)
    }
    getAlarmFromStorage()
  },[])
  const clocks = alarm!==null &&
        (<>
           <Clock date={alarm}/>
           <ClockDigital date={alarm}/>
         </>)
  return (
    <SafeAreaView>
      <PanGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        onGestureEvent={onGestureEvent}>
        <View style={styles.container}>
          {
            clocks
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
