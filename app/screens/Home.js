import React from 'react';
import { connect } from 'react-redux';
import {View} from 'react-native';
import AlarmSelector from '../components/AlarmSelector';
import Clock from '../components/Clock';
import NotificationsIOS from 'react-native-notifications';
import { selectAlarm, triggerAlarm, silenceAlarm } from '../redux';

class Home extends React.Component {
   constructor (props) {
      super(props);
      NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceived.bind(this));
      // NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceived.bind(this));
      // NotificationsIOS.addEventListener('notificationOpened', this.onNotificationOpened.bind(this));
   }
   onNotificationReceived(notification) {
      // only do this if there is no alarm ringing currently
      if (this.props.alarmRinging.index === null) {
         console.warn("Notification Received", notification);
         const alarm = JSON.parse(notification._data.alarm);
         const alarmIndex = +notification._data.alarmIndex;
         this.props.triggerAlarm(alarm, alarmIndex);
      }
   }

   componentWillUnmount() {
      // Don't forget to remove the event listeners to prevent memory leaks!
      NotificationsIOS.removeEventListener('notificationReceivedForeground', this.onNotificationReceived.bind(this));
      // NotificationsIOS.removeEventListener('notificationReceivedBackground', this.onNotificationReceived.bind(this));
      // NotificationsIOS.removeEventListener('notificationOpened', this.onNotificationOpened.bind(this));
   }

   render() {
      if (this.props.alarmRinging.index !== null) {
         return <Clock alarm={this.props.alarmRinging} clearAlarm={this.props.silenceAlarm} />
      } else if (this.props.alarms) {
         return (
            <AlarmSelector
                  alarms = {this.props.alarms}
                  navigation = {this.props.navigation}
                  setCurrentAlarm = {this.props.setCurrentAlarm}
               />
         )
      } else {
         return <View />
      }
   }
}

const mapStateToProps = ({alarms, alarmRinging}) => {
   return {alarms, alarmRinging}
}

const mapDispatchToProps = (dispatch) => {
   return {
      setCurrentAlarm: (alarm, alarmIndex) => dispatch(selectAlarm(alarm, alarmIndex)),
      triggerAlarm: (alarm, alarmIndex) => dispatch(triggerAlarm(alarm, alarmIndex)),
      silenceAlarm: () => dispatch(silenceAlarm())
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
