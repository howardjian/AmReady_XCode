import BackgroundTimer from 'react-native-background-timer';
import { createLocalNotification, cancelNotification } from './Notifications';
import { playAudio, stopAudio } from './Audio';
import { getDuration } from '../../utils/utils';

const SNOOZE_TIME_IN_MIN = 0.1;
const SET_INTERVAL_TIME_IN_MIN = 15;
const TIME_IN_MIN_BEFORE_CHECKING_DURATION = 120;

let audioId = null;
let localNotification = null;

export function resetAlarm(backgroundTimerId, setSnooze, alarm, alarmIndex) {
  clearBackgroundTimer(backgroundTimerId);
  cancelNotification(localNotification);
  if (audioId){
      stopAudio(audioId);
  }
  if (setSnooze) setTimer(alarm, alarmIndex, null, true);
}

export function clearBackgroundTimer(oldTimerId, newTimerId, updateAlarmTimer) {
  BackgroundTimer.clearTimeout(oldTimerId);
  if (newTimerId !== undefined) {
      updateAlarmTimer(oldTimerId, newTimerId);
  }
}

export function setTimer (alarm, alarmIndex, updateAlarmTimer, setSnooze = false) {
  let timeInMinUntilAlarmTriggers;
  if (setSnooze) {
    timeInMinUntilAlarmTriggers = SNOOZE_TIME_IN_MIN;
    return setAlarmTimer(timeInMinUntilAlarmTriggers, alarm, alarmIndex);
  } else {
    const arrivalTimeStr = alarm.arrivalTime;
    timeInMinUntilAlarmTriggers = calcTimeBeforeAlarmTriggers(arrivalTimeStr, +alarm.prepTime, +alarm.route.duration);

    const timeUntilWeStartCheckingDuration =
    timeInMinUntilAlarmTriggers - TIME_IN_MIN_BEFORE_CHECKING_DURATION < 0
    ?
    0
    :
    timeInMinUntilAlarmTriggers - TIME_IN_MIN_BEFORE_CHECKING_DURATION

    // bypass setinterval if time alarm is supposed to ring is less than time interval
    if (timeUntilWeStartCheckingDuration < SET_INTERVAL_TIME_IN_MIN) {
      return setAlarmTimer(timeInMinUntilAlarmTriggers, alarm, alarmIndex);
    } else {
      return setTimerToCheckDuration(timeUntilWeStartCheckingDuration, updateAlarmTimer, alarm, alarmIndex);
    }
  }
}

// NOTE: We modified the react-native-background-timer index.js file
// such that the output of the setTimeout function is invoked with the timerId.
// The timerId is passed to the notification object so the timer can be turned off eventually
// Normally, the timerId is returned from setTimeout, but we don't have access to it inside of the callback function


// # How the timer works
//
// We set an initial timeout function to wait until 2 hours before the initial alarm time.
//
// When this timer hits, we kill the set time out and trigger a setInterval to constantly check the duration of the selected route every 15 minutes. If there is a difference, we have to clear the current background timer and create a new one. This is because React Native's background timer inherently works like JavaScripts setTimeout/setInterval in that they cannot be modified
//
// If the current interval is less than or equal to 15 minutes before the alarm triggers, we kill the setInterval and set a final timeout for the alarm to ring.

function setTimerToCheckDuration(timeInMin, updateAlarmTimer, alarm, alarmIndex) {
  return BackgroundTimer.setTimeout(function () {
    return (timerId) => {
      const setIntervalTimeoutId = BackgroundTimer.setInterval(function() {
        return (timerId) => {
          getDuration(alarm)
          .then(duration => {
            // fetch duration
            const timeInMinUntilAlarmTriggers = calcTimeBeforeAlarmTriggers(alarm.arrivalTime, +alarm.prepTime, duration);
            if (timeInMinUntilAlarmTriggers <= SET_INTERVAL_TIME_IN_MIN) { // UPDATE
              // set ringer timeout
              let ringerTimeoutId = setAlarmTimer(timeInMinUntilAlarmTriggers, alarm, alarmIndex); // UPDATE: timeInMinUntilAlarmTriggers
              // clear timeout and update the timer
              clearBackgroundTimer(timerId, ringerTimeoutId, updateAlarmTimer);
            }
            // timeInMinUntilAlarmTriggers = timeInMinUntilAlarmTriggers - 2000;
          })
        }
      }, SET_INTERVAL_TIME_IN_MIN * 60000);
      // clear timeout and update the timer
      clearBackgroundTimer(timerId, setIntervalTimeoutId, updateAlarmTimer);
    }
  }, timeInMin * 60000);
}

function setAlarmTimer (timeInMin, alarm, alarmIndex) {
  return BackgroundTimer.setTimeout(function () {
    return (timerId) => {
      const alarmWithBackgroundTimerId = Object.assign({}, alarm, { timerId });
      audioId = playAudio();
      localNotification = createLocalNotification(alarmWithBackgroundTimerId, alarmIndex);
    }
  }, timeInMin * 60000);
}

export function getEstimatedWakeupTime(arrivalTimeStr, prepTime, duration) {
  const timeInMinUntilAlarmTriggers = calcTimeBeforeAlarmTriggers(arrivalTimeStr, prepTime, duration);
  return new Date(new Date().getTime() + timeInMinUntilAlarmTriggers * 60000);
}

function calcTimeBeforeAlarmTriggers(arrivalTimeStr, prepTime, duration) {
  const arrivalTimeInMin = calcTimeInMin(arrivalTimeStr);
  const timeNowInMin = calcTimeInMin();
  let timeBetweenArrivalTimeAndNow = arrivalTimeInMin - timeNowInMin;
  // add 24 hours if the arrival time has already elapsed, i.e. if arrival time is 9AM and current time is 11PM
  if (timeBetweenArrivalTimeAndNow <= 0) timeBetweenArrivalTimeAndNow += 24 * 60;
  const timeInMinUntilAlarmTriggers = timeBetweenArrivalTimeAndNow
    - (prepTime || 0) // in min
    - ((duration || 0) / 60); // in sec, convert to min

  // setInterval does not like negative numbers
  return timeInMinUntilAlarmTriggers < 0 ? 0 : timeInMinUntilAlarmTriggers;
}

function calcTimeInMin (time) {
  const dateObj = time ? new Date(time) : new Date();
  return dateObj.getHours() * 60 + dateObj.getMinutes();
}
