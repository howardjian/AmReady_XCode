import NotificationsIOS from 'react-native-notifications';

export function createLocalNotification (alarm, alarmIndex) {
	return NotificationsIOS.localNotification({
	    alertBody: 'Alarm is ringing!',
	    alertTitle: 'Alarm',
	    alertAction: 'Click here to dismiss',
	    soundName: 'chime.aiff',
	    category: '',
	    userInfo: {
	    	alarm,
	    	alarmIndex
	    }
	});
}

export function cancelNotification (localNotification) {
	// NotificationsIOS.cancelLocalNotification(localNotification);
	NotificationsIOS.cancelAllLocalNotifications(); // temporary fix
}
