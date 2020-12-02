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
import IconButton from "./components/IconButton";
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
import { Ionicons, Entypo } from "@expo/vector-icons";
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

// function to parse text
function parseText(text) {
  return parse(text.padStart(4, "0"), "HHmm", new Date());
}

export default function App() {
  const [alarmState, setAlarmState] = useState({ time: null });
  const [timeText, setTimeText] = useState(null);
  const [isSettingTime, setIsSettingTime] = useState(false);

  const forceUpdate = useForceUpdate();

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

  // clear old notification and schedule new one
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
        setAlarmState({ time: null });
      } else {
        forceUpdate();
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [alarmState]);

  // function to set alarm time from valid text, by parsing it
  const maybeSetAlarmFromText = (text) => {
    let parsedText = parseText(text);
    if (isValid(parsedText)) {
      setTimeText(null);
      setAlarmState({
        time: isAfter(parsedText, new Date())
          ? parsedText
          : add(parsedText, { days: 1 }),
      });
      setIsSettingTime(false);
    }
  };

  // function to set the time text from presses on the number pad
  const onNumberPadPress = useCallback((n) => {
    setTimeText((t) => {
      if (t === null) {
        return n;
      } else if (t.length === 4) {
        return t;
      } else {
        let newText = t + n;
        if (newText.length === 4) {
          maybeSetAlarmFromText(newText);
        }
        return newText;
      }
    });
  });

  const onNumberPadEnter = () => {
    maybeSetAlarmFromText(timeText);
  };

  const onNumberPadClear = useCallback(() => {
    setTimeText(null);
    setIsSettingTime(false);
  });

  const parsedText = timeText && parseText(timeText);
  const validTimeText = isValid(parsedText);
  const renderTime = alarmState.time || new Date();

  // if alarm time is null, render the current time
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {renderTime && (
          <>
            <Clock date={renderTime} />
            <ClockDigital timeText={timeText} date={renderTime} />
            <AlarmCountdown date={alarmState.time} />
            {isSettingTime ? (
              <NumberPad
                enterEnabled={validTimeText}
                onEnter={onNumberPadEnter}
                onPress={onNumberPadPress}
                onClear={onNumberPadClear}
              />
            ) : (
              <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                  <IconButton
                    icon={<Ionicons name="md-alarm" size={36} color="white" />}
                    enabled={true}
                    onPress={() => setIsSettingTime(true)}
                    text={alarmState.time === null ? "Set" : "Change"}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <IconButton
                    icon={
                      <Entypo name="squared-cross" size={36} color="white" />
                    }
                    tintColor="#990000"
                    enabled={alarmState.time !== null}
                    onPress={() => {
                      setAlarmState({ time: null });
                    }}
                    text="Clear"
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 32,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonsContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginBottom: 16,
  },
});
