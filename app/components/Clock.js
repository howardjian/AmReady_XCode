import React from 'react';
import { Text, View, Button } from 'react-native';
import { resetAlarm } from '../features/Timer';

const dismissAlarm = (timerId) => {
	console.warn('DISMISSING', timerId);
	resetAlarm(timerId);
}

const snoozeAlarm = (alarm) => {
	console.warn('alarm index in snooze', JSON.stringify(alarm));
	resetAlarm(alarm.alarmInfo.timerId, true, alarm.alarmInfo, alarm.index); // 2nd arg is isSnooze
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
				snoozeAlarm(props.alarm)
				props.clearAlarm();
			}}></Button>
		</View>
	)
}
