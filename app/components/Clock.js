import React from 'react';
import { Text, View, Image } from 'react-native';
import {Button, Divider} from 'react-native-elements';
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
		<View >
			<Image style={{  height: 680, width: 420, alignContent: 'center', backgroundColor:'transparent' }} source={require('../assets/sunset-on-a-beach.gif')}>

					<Divider style={{paddingTop: 460, opacity: 0}}>	</Divider>
				 <Button
				 	style={{  opacity: 0.5, backgroundColor: 'white'}}

					textStyle={{ color: 'yellow', fontWeight: 'bold', fontSize: 22}}
					title="Snooze"
					onPress={() => {
					snoozeAlarm(props.alarm)
					props.clearAlarm();}}>
				 </Button>

				 <Divider style={{paddingTop: 20, opacity: 0}}>	</Divider>
			<Button
				style={{  opacity: 0.5, backgroundColor: 'white'}}

				textStyle={{ color: 'yellow', fontWeight: 'bold', fontSize: 22}}
				title="Dismiss" onPress={() => {
				dismissAlarm(props.alarm.alarmInfo.timerId)
				props.clearAlarm();
			}}>
			</Button>


			</Image>




		</View>

	)
}



