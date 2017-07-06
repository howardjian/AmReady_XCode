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
    if (setSnooze) setTimer(alarm, alarmIndex, null, true);
}

// export function clearBackgroundTimer(oldTimerId, newTimerId, type) {
//     BackgroundTimer.clearTimeout(oldTimerId);
//     if (newTimerId !== undefined) updateAlarmTimer(oldTimerId, newTimerId, type);
// }

export function clearBackgroundTimer(oldTimerId, newTimerId, updateAlarmTimer) {
    BackgroundTimer.clearTimeout(oldTimerId);
    if (newTimerId !== undefined) {
        console.log('NEW TIMER ID', newTimerId);
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
        // console.warn(arrivalTimeStr, alarm.prepTime, alarm.duration);
    }
    // settimeout( setInterval(someNewFuncToFetchDuration, 15min ) ,2hoursBefore timeInMinUntilAlarmTriggers)
    // someNewFuncToFetchDuration = fetchduration, run calcTimeBeforeAlarmTriggers, if difference, reset timeinMin
    
    // console.warn('TIME', timeInMinUntilAlarmTriggers);
    
    // console.warn('AFTER UPDATING', timeInMinUntilAlarmTriggers);
    
    // NOTE: We modified the react-native-background-timer index.js file
    // such that the output of the setTimeout function is invoked with the timerId.
    // The timerId is passed to the notification object so the timer can be turned off eventually
    // Normally, the timerId is returned from setTimeout, but we don't have access to it inside of the callback function

    // return setTimerToCheckDuration(timeInMinUntilAlarmTriggers - (2*60*60000), updateAlarmTimer);
    return setTimerToCheckDuration(5000, updateAlarmTimer, alarm, alarmIndex); // 10 sec
}

function setTimerToCheckDuration(time, updateAlarmTimer, alarm, alarmIndex) {
    return BackgroundTimer.setTimeout(function () { // 1
        return (timerId) => {
        console.warn('1', timerId);
        let timeInMinUntilAlarmTriggers = 4000;
          const setIntervalTimeoutId = BackgroundTimer.setInterval(function() {
                return (timerId) => {
                    console.warn('2', timerId);
                    // fetch duration
                    // let timeInMinUntilAlarmTriggers = calcTimeBeforeAlarmTriggers(arrivalTimeStr, +alarm.prepTime, fetch());
                    // let timeInMinUntilAlarmTriggers = 4000;
                    console.warn('BEFORE UPDATING', timeInMinUntilAlarmTriggers);
                    if (timeInMinUntilAlarmTriggers <= 2000) { // UPDATE
                        // set ringer timeout
                        let ringerTimeoutId = setAlarmTimer(0.1, alarm, alarmIndex); // UPDATE: timeInMinUntilAlarmTriggers
                        console.warn('2.5', ringerTimeoutId);
                        // clear timeout and update the timer
                        clearBackgroundTimer(timerId, ringerTimeoutId, updateAlarmTimer);
                    }
                    timeInMinUntilAlarmTriggers = timeInMinUntilAlarmTriggers - 2000;
                }
          }, 2000) // UPDATE
          // clear timeout and update the timer
          console.warn('1.5', setIntervalTimeoutId);
          clearBackgroundTimer(timerId, setIntervalTimeoutId, updateAlarmTimer); // 1
        }
      }, time);
}

function setAlarmTimer (timeInMin, alarm, alarmIndex) {
    return BackgroundTimer.setTimeout(function () {
        return (timerId) => {
            console.warn('3', timerId);
          // console.warn('timer id from inside timer function', timerId);
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

