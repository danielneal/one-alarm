import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { SafeAreaView,StyleSheet, Text, View } from "react-native";
import * as Svg from "react-native-svg";
import Clock from "./components/Clock";
import ClockDigital from "./components/ClockDigital";
import { State, PanGestureHandler } from "react-native-gesture-handler";
import add from "date-fns/add";
import * as Notifications from "expo-notifications";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";

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
  const [alarm, setAlarm] = useState(roundToNearestMinutes(new Date()));
  const [handlerState, setHandlerState] = useState();
  const [alarmAtGestureBegin, setAlarmAtGestureBegin] = useState(alarm);
  const [notificationID, setNotificationID] = useState(null);
  const onHandlerStateChange = useCallback(async (e) => {
    if (e.nativeEvent.state === State.BEGAN) {
      setAlarmAtGestureBegin(alarm);
    }
    if (e.nativeEvent.state === State.END) {
      if (notificationID !== null) {
        await Notifications.cancelScheduledNotificationAsync(notificationID);
      }
      const _notificationID = await Notifications.scheduleNotificationAsync({
        content: {
          title: "One Alarm",
          subtitle: "It's time.",
          sound: "alarm.wav",
        },
        trigger: {
          hours:alarm.getHours(),
          minutes:alarm.getMinutes(),
          repeat: true
        },
      });
      setNotificationID(_notificationID);
    }
  });
  const onGestureEvent = useCallback(async (e) => {
    setAlarm(add(alarmAtGestureBegin, { minutes: e.nativeEvent.translationY/2 }));
  });

  return (
    <SafeAreaView>
      <PanGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        onGestureEvent={onGestureEvent}>
        <View style={styles.container}>
          <Clock date={alarm} />
          <ClockDigital date={alarm}/>
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
