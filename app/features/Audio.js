// Import the react-native-sound module
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import {createLocalNotification, cancelNotification} from './Notifications';

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
    // sound.setNumberOfLoops(-1);
  });
  return sound;
}

export function stopAudio(backgroundTimerId, notification, snoozeTime) {
    // add in snooze
    BackgroundTimer.clearInterval(backgroundTimerId);
    cancelNotification(notification);
}

export function setTimer (arrivalTimeStr, prepTime, duration) {
    let timeInMinUntilAlarmTriggers = calcTimeInMin(arrivalTimeStr)
      - prepTime // in min
      - (duration / 60) // in sec, convert to min
      - calcTimeInMin();

    // setInterval does not like negative numbers
    timeInMinUntilAlarmTriggers = timeInMinUntilAlarmTriggers < 0 ? 0 : timeInMinUntilAlarmTriggers;

    return BackgroundTimer.setInterval(() => {
         playAudio();
         createLocalNotification();
      }, timeInMinUntilAlarmTriggers * 60000);
}

function calcTimeInMin (time) {
    const dateObj = time ? new Date(time) : new Date();
    return dateObj.getHours() * 60 + dateObj.getMinutes();
}

