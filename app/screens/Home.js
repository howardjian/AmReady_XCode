import React from 'react';
import { AsyncStorage } from 'react-native';
import AlarmSelector from '../components/AlarmSelector';
import initialState from '../../seed';
import Clock from '../components/Clock';
import NotificationsIOS from 'react-native-notifications';

export default class Home extends React.Component {
   constructor () {
      super();
      this.state = {
         data: initialState,
         notification: null
      }
      this.clearAlarm = this.clearAlarm.bind(this);
      NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
      NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
      NotificationsIOS.addEventListener('notificationOpened', this.onNotificationOpened.bind(this));
   }
   onNotificationReceivedForeground(notification) {
      console.log("Notification Received - Foreground", notification);
      this.setState({notification: notification});
   }

   onNotificationReceivedBackground(notification) {
      console.log("Notification Received - Background", notification);
   }

   onNotificationOpened(notification) {
      console.log("Notification opened by device user", notification);
   }

   componentWillUnmount() {
      // Don't forget to remove the event listeners to prevent memory leaks!
      NotificationsIOS.removeEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
      NotificationsIOS.removeEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
      NotificationsIOS.removeEventListener('notificationOpened', this.onNotificationOpened.bind(this));
   }
   componentWillMount () {
      // this.setData(this.state.data); // use this while testing to initialize local storage
   }

   componentDidMount() {
      AsyncStorage.getItem('data').then((value) => {
         this.setState({data: value});
      });
   }

   setData (value) {
      AsyncStorage.setItem('data', value);
      this.setState({data: value});
   }

   clearAlarm () {
      this.setState({notification: null})
   }

   render() {
      alarmsData.userAlarms = JSON.parse(this.state.data);
      if (this.state.notification) {
         return <Clock timerId={1} notification={this.state.notification} clearAlarm={this.clearAlarm} />
      } else {
         return (
            <AlarmSelector
                  data = {JSON.parse(this.state.data)}
                  setData = {this.setData}
                  navigation = {this.props.navigation}
            />
         )
      }
   }
}

export function alarmsData() {
  this.userAlarms = '';
}
