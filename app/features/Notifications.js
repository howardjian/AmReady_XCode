import NotificationsIOS from 'react-native-notifications';

export function createLocalNotification (alarm, alarmIndex) {
	return NotificationsIOS.localNotification({
	    alertBody: 'Alarm is ringing!',
	    alertTitle: 'Alarm',
	    alertAction: 'Click here to dismiss',
	    soundName: 'chime.aiff',
	    category: '',
	    userInfo: {
	    	alarm: JSON.stringify(alarm),
	    	alarmIndex: String(alarmIndex)
	    }
	});
}

export function cancelNotification (localNotification) {
	console.log('LOCAL NOTIFICATION', localNotification);
	NotificationsIOS.cancelLocalNotification(localNotification);
}
