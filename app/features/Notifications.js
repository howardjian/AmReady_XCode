import NotificationsIOS from 'react-native-notifications';

export function createLocalNotification () {
	return NotificationsIOS.localNotification({
	    alertBody: "Local notificiation!",
	    alertTitle: "Local Notification Title",
	    alertAction: "Click here to open",
	    soundName: "chime.aiff",
	    category: "SOME_CATEGORY",
	    userInfo: { }
	});
}

export function cancelNotication (localNotification) {
	NotificationsIOS.cancelLocalNotification(localNotification);
}
