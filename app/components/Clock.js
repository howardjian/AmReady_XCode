import React from 'react';
import { Text, View, Button } from 'react-native';
import {stopAudio} from '../features/Audio';

const dismissAlarm = (timerId) => {
	console.warn('DISMISSING', timerId);
	stopAudio(timerId);
}

const snoozeAlarm = (timerId) => {
	stopAudio(timerId, 5000); // 2nd arg is snooze interval
}

export default (props) => {
	return (
		<View>
			<Text>Alarm is ringing!</Text>
			<Button title="I'm Ready!" onPress={() => {
				dismissAlarm(props.alarm.alarmInfo.timerId)
				props.clearAlarm();
			}}>
			</Button>
			<Button title="I'm not Ready!" onPress={() => {
				snoozeAlarm(props.alarm.alarmInfo.timerId)
				props.clearAlarm();
			}}></Button>
		</View>
	)
}
