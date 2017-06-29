// Import the react-native-sound module
var Sound = require('react-native-sound');

export function playAudio () {
  // Enable playback in silence mode (iOS only)
  Sound.setCategory('Playback');
console.log('I AM PLAYING');
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
    // Get properties of the player instance
    console.log('volume: ' + sound.getVolume());
    console.log('pan: ' + sound.getPan());
    console.log('loops: ' + sound.getNumberOfLoops());
    sound.stop();
  });
  return sound;
}

export function stopAudio (sound) {
    sound.stop(); 
    sound.release(); // Release the audio player resource
}

  // // Seek to a specific point in seconds
  // whoosh.setCurrentTime(2.5);

  // // Get the current playback point in seconds
  // whoosh.getCurrentTime((seconds) => console.log('at ' + seconds));

  // // Pause the sound
  // whoosh.pause();
