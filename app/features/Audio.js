// Import the react-native-sound module
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import {createLocalNotification, cancelNotification} from './Notifications';

const SNOOZE_TIME_IN_MIN = 0.1;

let audioId = null;
let localNotification = null;

export function playAudio () {
  // Enable playback in silence mode (iOS only)
  Sound.setCategory('Playback');
  // Load the sound file 'bells.mp3' from the app bundle
  // See notes below about preloading sounds within initialization code below.
  var sound = new Sound('bells.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
    // Play the sound with an onEnd callback
    sound.play((success) => {
      if (success) {
        console.warn('successfully finished playing');
      } else {
        console.warn('playback failed due to audio decoding errors');
      }
    });

    // Reduce the volume by half
    sound.setVolume(0.5);
    // Position the sound to the full right in a stereo field
    sound.setPan(1);
    // Loop indefinitely until stop() is called
    sound.setNumberOfLoops(-1);
  });
  return sound;
}

export function resetAlarm(backgroundTimerId, setSnooze, alarm, alarmIndex) {
    console.warn('CLEARING TIME', backgroundTimerId);
    BackgroundTimer.clearTimeout(backgroundTimerId);
    cancelNotification(localNotification);
    console.warn('AUDIO SOUND', audioId);
    audioId.stop();
    if (setSnooze) setTimer(alarm, alarmIndex, true);
}

export function setTimer (alarm, alarmIndex, setSnooze = false) {
    let timeInMinUntilAlarmTriggers;
    if (setSnooze) {
        timeInMinUntilAlarmTriggers = SNOOZE_TIME_IN_MIN;
    } else {
        const arrivalTimeStr = alarm.arrivalTime;
        const prepTime = +alarm.prepTime || 0;
        const duration = +alarm.route.duration || 0;

        console.warn(arrivalTimeStr, prepTime, duration);

        timeInMinUntilAlarmTriggers = calcTimeInMin(arrivalTimeStr)
          - prepTime // in min
          - (duration / 60) // in sec, convert to min
          - calcTimeInMin();

        // setInterval does not like negative numbers
        timeInMinUntilAlarmTriggers = timeInMinUntilAlarmTriggers < 0 ? 0 : timeInMinUntilAlarmTriggers;
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

function calcTimeInMin (time) {
    const dateObj = time ? new Date(time) : new Date();
    return dateObj.getHours() * 60 + dateObj.getMinutes();
}

