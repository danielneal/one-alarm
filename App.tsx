import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  InputAccessoryView,
  Button,
  Keyboard,
} from "react-native";
import * as Svg from "react-native-svg";
import Clock from "./components/Clock";
import ClockDigital from "./components/ClockDigital";
import AlarmCountdown from "./components/AlarmCountdown";
import NumberPad from "./components/NumberPad";
import {
  State,
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import add from "date-fns/add";
import isAfter from "date-fns/isAfter";
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import parse from "date-fns/parse";
import formatISO from "date-fns/formatISO";
import useForceUpdate from "./hooks/useForceUpdate";
const alarmStorageKey = "@alarm";
const notificationID = "@alarm";

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

function serialize(state) {
  return JSON.stringify({
    ...state,
    time: state.time && formatISO(state.time),
  });
}

function deserialize(s) {
  const parsed = JSON.parse(s);
  if (parsed) {
    return { time: parsed.time && parseISO(parsed.time) };
  } else {
    return null;
  }
}

export default function App() {
  const [alarmState, setAlarmState] = useState({ time: null });
  const [timeDuringGesture, setTimeDuringGesture] = useState(null);
  const [handlerState, setHandlerState] = useState();
  const [alarmTimeAtGestureBegin, setAlarmTimeAtGestureBegin] = useState(null);
  const [timeText, setTimeText] = useState(null);
  const forceUpdate = useForceUpdate();

  const onHandlerStateChange = useCallback(async (e) => {
    // capture the alarm time at the beginning of the gesture
    if (e.nativeEvent.state === State.BEGAN) {
      setAlarmTimeAtGestureBegin(alarmState.time || new Date());
    }

    // set the alarm state at the end of the gesture
    if (e.nativeEvent.state === State.END) {
      setAlarmState((state) => {
        let time = isAfter(new Date(), timeDuringGesture)
          ? add(timeDuringGesture, { days: 1 })
          : timeDuringGesture;
        time = isAfter(time, add(new Date(), { days: 1 }))
          ? add(time, { days: -1 })
          : time;
        return { ...state, time: time };
      });

      // then set the time during gesture to null
      setTimeDuringGesture(null);
      setTimeText(null);
    }
  });

  const onGestureEvent = useCallback(async (e) => {
    let newTime = add(alarmTimeAtGestureBegin, {
      minutes: e.nativeEvent.translationY / 2,
    });
    setTimeDuringGesture(newTime);
  });

  // initialize alarm state from storage on mount
  useEffect(() => {
    const getAlarmFromStorage = async () => {
      const alarmState = await AsyncStorage.getItem(alarmStorageKey);
      const parsedAlarmState = deserialize(alarmState);
      const defaultAlarmState = { time: null };
      setAlarmState(
        parsedAlarmState === null ? defaultAlarmState : parsedAlarmState
      );
    };
    getAlarmFromStorage();
  }, []);

  const saveAlarmState = async () => {
    if (alarmState !== null) {
      AsyncStorage.setItem(alarmStorageKey, serialize(alarmState));
    }
  };

  const scheduleNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(notificationID);
    if (alarmState.time !== null) {
      await Notifications.scheduleNotificationAsync({
        identifier: notificationID,
        content: {
          title: "One Alarm",
          subtitle: "It's time.",
          sound: "alarm.wav",
        },
        trigger: alarmState.time,
      });
    }
    return null;
  };

  // save and unschedule/reschedule alarm notification if alarmstate changes
  useEffect(() => {
    saveAlarmState();
    scheduleNotification();
  }, [alarmState]);

  // check every second, and set alarm time to null if current time > alarm time
  // then the clock will show the current time if no alarm is set.
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (isAfter(new Date(), alarmState && alarmState.time)) {
        setAlarmState((state) => ({ ...state, time: null }));
      } else {
        forceUpdate();
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [alarmState]);

  const onNumberPadPress = useCallback((n) => {
    setTimeText((t) => {
      if (t === null) {
        return n;
      } else {
        return t + n;
      }
    });
  });
  const parsedText =
    timeText && parse(timeText.padStart(4, "0").slice(-4), "HHmm", new Date());

  useEffect(() => {
    if (timeText !== null) {
      if (isValid(parsedText)) {
        if (isAfter(new Date(), parsedText)) {
          setAlarmState({ time: add(parsedText, { days: 1 }) });
        } else {
          setAlarmState({ time: parsedText });
        }
      }
      setTimeText(timeText.padStart(4, "0").slice(-4));
    }
    console.log(timeText);
  }, [timeText]);

  const onNumberPadClear = useCallback(() => {
    if (timeText === null) {
      setAlarmState({ time: null });
    }
    setTimeText(null);
  });

  const validTimeText = timeText === null || isValid(parsedText);
  const renderTime = alarmState.time || new Date();

  // if alarm time is null, render the current time
  return (
    <SafeAreaView>
      <PanGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        onGestureEvent={onGestureEvent}
      >
        <View style={styles.container}>
          {renderTime && (
            <>
              <Clock date={timeDuringGesture || renderTime} />
              <ClockDigital
                validTimeText={validTimeText}
                timeText={timeText}
                date={timeDuringGesture || renderTime}
              />
              <AlarmCountdown date={alarmState.time} />
              <NumberPad
                onPress={onNumberPadPress}
                onClear={onNumberPadClear}
              />
            </>
          )}
        </View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
