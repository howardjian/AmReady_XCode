import React from 'react';
import { connect } from 'react-redux';
import {View} from 'react-native';
import AlarmSelector from '../components/AlarmSelector';
import Clock from '../components/Clock';
import NotificationsIOS from 'react-native-notifications';
import { selectAlarm } from '../redux';

class Home extends React.Component {
   constructor (props) {
      super(props);
      this.state = {
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
      // this.setData(initialState); // use this while testing to initialize local storage
      console.warn(JSON.stringify(this.props));
   }

   clearAlarm () {
      this.setState({notification: null})
   }

   render() {
      console.log('home', this.props);
      if (this.state.notification) {
         return <Clock timerId={1} notification={this.state.notification} clearAlarm={this.clearAlarm} />
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

const mapStateToProps = ({alarms}) => {
   return {alarms}
}

const mapDispatchToProps = (dispatch) => {
   return {
      setCurrentAlarm: (alarm, alarmIndex) => dispatch(selectAlarm(alarm, alarmIndex))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
