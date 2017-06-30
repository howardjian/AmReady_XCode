import NotificationsIOS from 'react-native-notifications';

export function createLocalNotification () {
	return NotificationsIOS.localNotification({
	    alertBody: 'Alarm is ringing!',
	    alertTitle: 'Alarm',
	    alertAction: 'Click here to dismiss',
	    soundName: 'chime.aiff',
	    category: '',
	    userInfo: { }
	});
}

export function cancelNotification (localNotification) {
	// NotificationsIOS.cancelLocalNotification(localNotification);
	NotificationsIOS.cancelAllLocalNotifications(); // temporary fix
}
