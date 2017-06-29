import React from 'react';
import { Text, View, Button } from 'react-native';
import { playAudio, stopAudio } from '../features/Audio';

export default class extends React.Component {
	constructor (props) {
		console.log('HUH');
		super(props);
		this.state = {
			time: false
		}
		this.setTimer = this.setTimer.bind(this);

		const timer = this.calcTimeInMin(this.props.arrivalTime)
			- this.props.prepTime
			- this.props.duration
			- this.calcTimeInMin(new Date());

		this.setTimer(timer);
	}


	calcTimeInMin (time) {
		const dateObj = new Date(time);
		return dateObj.getHours() * 60 + dateObj.getMinutes();
	}

	dismissAlarm (sound) {
		this.setState({ time: false });
		if (sound) stopAudio(sound);
	}

	snoozeAlarm (sound) {
		this.setState({ time: false });
		this.setTimer(5000);
		if (sound) stopAudio(sound);
	}

	setTimer (interval) {
		setTimeout(() => {
			this.setState({ time: true })
		}, interval);
	}

	render () {
		let soundObj;
		if (this.state.time) {
			soundObj = playAudio();
			console.warn(JSON.stringify(soundObj));
			// .then((sound) => {
			// 	soundObj = sound;
			// });
		}
		return (
			<View>
			{
				this.state.time ?
					<View>
						<Text>{String(new Date())}</Text>
						<Button title="I'm Ready!" onPress={() => this.dismissAlarm(soundObj)}></Button>
						<Button title="I'm not Ready!" onPress={() => this.snoozeAlarm(soundObj)}></Button>
					</View>
					:
					<Text>NO</Text>

			}
			</View>
		)
	}
}
