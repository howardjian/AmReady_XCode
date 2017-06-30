import React from 'react';
import { Text, View, Button } from 'react-native';
import {stopAudio} from '../features/Audio';
import { NavigationActions } from 'react-navigation';

export default class extends React.Component {
	constructor (props) {
		super(props);
	}

	dismissAlarm () {
		stopAudio(1, this.props.notification); // this needs to sync up with the timerId on the alarm (passed from Home)
		this.navigateHome();
	}

	snoozeAlarm () {
		stopAudio(1, this.props.notification, 5000); // 2nd arg is snooze interval
		this.navigateHome();
	}

	navigateHome () {
		this.props.navigation.dispatch(NavigationActions.reset(
	      {
	        index: 0,
	        actions: [
	          NavigationActions.navigate({ routeName: 'home'})
	        ]
	      }));
	}

	render () {
		return (
			<View>
				<Text>Alarm is ringing!</Text>
				<Button title="I'm Ready!" onPress={() => this.dismissAlarm()}></Button>
				<Button title="I'm not Ready!" onPress={() => this.snoozeAlarm()}></Button>
			</View>
		)
	}
}
