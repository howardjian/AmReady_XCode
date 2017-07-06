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
    if(audioId){
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
        let timeUntilWeStartCheckingDuration = timeInMinUntilAlarmTriggers - TIME_IN_MIN_BEFORE_CHECKING_DURATION;
        timeUntilWeStartCheckingDuration = timeUntilWeStartCheckingDuration < 0 ? 0 : timeUntilWeStartCheckingDuration;
        return setTimerToCheckDuration(timeUntilWeStartCheckingDuration, updateAlarmTimer, alarm, alarmIndex);
    }
}

// NOTE: We modified the react-native-background-timer index.js file
// such that the output of the setTimeout function is invoked with the timerId.
// The timerId is passed to the notification object so the timer can be turned off eventually
// Normally, the timerId is returned from setTimeout, but we don't have access to it inside of the callback function

function setTimerToCheckDuration(timeInMin, updateAlarmTimer, alarm, alarmIndex) {
    return BackgroundTimer.setTimeout(function () { // 1
        return (timerId) => {
        console.warn('1', timerId);
        // let timeInMinUntilAlarmTriggers = 4000;
          const setIntervalTimeoutId = BackgroundTimer.setInterval(function() {
                return (timerId) => {
                    getDuration(alarm)
                    .then(duration => {
                        console.warn('2', timerId);
                        console.warn('pliss', duration);
                        // fetch duration
                        let timeInMinUntilAlarmTriggers = calcTimeBeforeAlarmTriggers(alarm.arrivalTime, +alarm.prepTime, duration);
                        console.warn('BEFORE UPDATING', timeInMinUntilAlarmTriggers);
                        if (timeInMinUntilAlarmTriggers <= SET_INTERVAL_TIME_IN_MIN) { // UPDATE
                            // set ringer timeout
                            let ringerTimeoutId = setAlarmTimer(timeInMinUntilAlarmTriggers, alarm, alarmIndex); // UPDATE: timeInMinUntilAlarmTriggers
                            console.warn('2.5', ringerTimeoutId);
                            // clear timeout and update the timer
                            clearBackgroundTimer(timerId, ringerTimeoutId, updateAlarmTimer);
                        }
                        // timeInMinUntilAlarmTriggers = timeInMinUntilAlarmTriggers - 2000;
                    })
                }
          }, SET_INTERVAL_TIME_IN_MIN * 60000)
          // clear timeout and update the timer
          console.warn('1.5', setIntervalTimeoutId);
          clearBackgroundTimer(timerId, setIntervalTimeoutId, updateAlarmTimer);
        }
      }, timeInMin * 60000);
}

function setAlarmTimer (timeInMin, alarm, alarmIndex) {
    return BackgroundTimer.setTimeout(function () {
        return (timerId) => {
            console.warn('3', timerId);
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
