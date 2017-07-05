import BackgroundTimer from 'react-native-background-timer';
import { createLocalNotification, cancelNotification } from './Notifications';
import { playAudio, stopAudio } from './Audio';

const SNOOZE_TIME_IN_MIN = 0.1;

let audioId = null;
let localNotification = null;

export function resetAlarm(backgroundTimerId, setSnooze, alarm, alarmIndex) {
    console.warn('CLEARING TIME', backgroundTimerId);
    clearBackgroundTimer(backgroundTimerId);
    cancelNotification(localNotification);
    console.warn('AUDIO SOUND', audioId);
    stopAudio(audioId);
    if (setSnooze) setTimer(alarm, alarmIndex, true);
}

export function clearBackgroundTimer(backgroundTimerId) {
    BackgroundTimer.clearTimeout(backgroundTimerId);
}

export function setTimer (alarm, alarmIndex, setSnooze = false) {
    let timeInMinUntilAlarmTriggers;
    if (setSnooze) {
        timeInMinUntilAlarmTriggers = SNOOZE_TIME_IN_MIN;
    } else {
        const arrivalTimeStr = alarm.arrivalTime;
        timeInMinUntilAlarmTriggers = calcTimeBeforeAlarmTriggers(arrivalTimeStr, +alarm.prepTime, +alarm.route.duration);
        console.warn(arrivalTimeStr, alarm.prepTime, alarm.duration);
    }
    
    console.warn('TIME', timeInMinUntilAlarmTriggers);
    
    // NOTE: We modified the react-native-background-timer index.js file
    // such that the output of the setTimeout function is invoked with the timerId.
    // The timerId is passed to the notification object so the timer can be turned off eventually
    // Normally, the timerId is returned from setTimeout, but we don't have access to it inside of the callback function

    return BackgroundTimer.setTimeout(function () {
        return (timerId) => {
          console.warn('timer id from inside timer function', timerId);
          const alarmWithBackgroundTimerId = Object.assign({}, alarm, { timerId });
          audioId = playAudio();
          localNotification = createLocalNotification(alarmWithBackgroundTimerId, alarmIndex);
        }
      }, timeInMinUntilAlarmTriggers * 60000);
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
    console.warn('TIME UNTIL ALARM RINGS', timeBetweenArrivalTimeAndNow/60);
    let timeInMinUntilAlarmTriggers = timeBetweenArrivalTimeAndNow
      - (prepTime || 0) // in min
      - ((duration || 0) / 60); // in sec, convert to min

    // setInterval does not like negative numbers
    return timeInMinUntilAlarmTriggers < 0 ? 0 : timeInMinUntilAlarmTriggers;
}

function calcTimeInMin (time) {
    const dateObj = time ? new Date(time) : new Date();
    return dateObj.getHours() * 60 + dateObj.getMinutes();
}

