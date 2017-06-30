// Import the react-native-sound module
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import {createLocalNotification, cancelNotification} from './Notifications';

let notification = null;

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

export function setTimer() {
    return BackgroundTimer.setInterval(() => {
         playAudio();
         notification = createLocalNotification();
         console.log("NOTIFICATION", notification);
      }, 5000);
}

export function stopAudio(backgroundTimerId) {
    BackgroundTimer.clearInterval(backgroundTimerId);
    cancelNotification(notification);
}
