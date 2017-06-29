import React from 'react';
import { Text, View, Button } from 'react-native';
import {setTimer, stopAudio} from '../features/Audio';

export default class extends React.Component {
	constructor (props) {
		super(props);
		const estimatedTime = this.calcTimeInMin(this.props.arrivalTime)
			- this.props.prepTime
			- this.props.duration
			- this.calcTimeInMin();
	
		this.state = {
			time: estimatedTime,
			backgroundTimerId: null
		}
	}

	componentDidMount() {
		console.log("THIS IS THE STATE:", this.state);
		this.setState({backgroundTimerId: setTimer()});
	}

	calcTimeInMin (time) {
		const dateObj = time ? new Date(time) : new Date();
		return dateObj.getHours() * 60 + dateObj.getMinutes();
	}

	dismissAlarm () {
		this.setState({time:false});
		stopAudio(this.state.backgroundTimerId);
	}

	snoozeAlarm (sound) {
		this.setState({ time: false });
		// this.setTimer(5000);
		if (sound) stopAudio(sound);
	}

	render () {
		return (
			<View>
			{
				this.state.time ?
					<View>
						<Text>{String(new Date())}</Text>
						<Button title="I'm Ready!" onPress={() => this.dismissAlarm()}></Button>
						<Button title="I'm not Ready!" onPress={() => this.snoozeAlarm()}></Button>
					</View>
					:
					<Text>{String(new Date())}</Text>

			}
			</View>
		)
	}
}
