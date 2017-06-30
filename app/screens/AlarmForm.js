import React from 'react';
import {
  AsyncStorage,
  Text,
  TextInput,
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  Button,
  DatePickerIOS } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Directions from '../components/Directions';
import {setTimer} from '../features/Audio';

export default class extends React.Component  {
	constructor (props) {
		super(props);

    this.state ={
      alarmName: '',
      start:null,
      end:null,
      start_lat: 37.78825,
      start_long: -122.4324,
      end_lat: 37.78825 ,
      end_long: -122.4324,
      directions:false,
      trainOptions: [],
      routeSelectedBool: false,
      routeIndex: null,
      prepTime: '',
      duration:'',
      arrivalTime: new Date(),
      timerId: null
    }

		this.saveDetails = this.saveDetails.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveNewAlarm = this.saveNewAlarm.bind(this);
    this.AsyncStorageFormat = this.AsyncStorageFormat.bind(this);
    this.getDuration = this.getDuration.bind(this);
	}

  componentWillMount() {
    let selectedUserData = this.props.navigation.state.params
    if(selectedUserData.alarm) {
      this.setState(stateifyDbData(selectedUserData.alarm));
    }
  }

  handleChange(changedState) {
    let newState = Object.assign({}, this.state, changedState)
    this.setState(newState);
  }
  getDuration(duration){
    this.setState({duration})
  }
  saveNewAlarm() {
    // 1. Get old alarms
    // 2. convert old alarms to JSON
    // 3. push new alarm to alarms array
    // 4. stringify alarms
    // 5. set item
    let db = this.props.navigation.state.params.data;
    db.alarms.push(this.AsyncStorageFormat());
    return AsyncStorage.mergeItem('data', JSON.stringify(db), (err, result) => {
      if (err){
        console.warn("ERROR", err);
      }
      return result;
    })
  }

	saveDetails() {
    this.saveNewAlarm()
    .then((result) => {
      // console.error(result);
      // set background timer
      if (!this.state.timerId) {
        const timerId = setTimer(this.state.arrivalTime, +this.state.prepTime, +this.state.duration);
        this.setState({timerId}, () => {
            this.saveNewAlarm();
        });
        console.warn('CREATED TIMER ID', timerId);
      } else {
        console.warn('TIMER ID', timerId);
      }
      // need to write in case where we are editing an alarm
    });
    this.props.navigation.dispatch(NavigationActions.reset(
      {
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'home'})
        ]
      }));
  }

  onDateChange (date) {
    console.log(date);
    this.setState({arrivalTime: date});
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  AsyncStorageFormat(){
    const currentAlarm = this.state;

    return {
      timerId: currentAlarm.timerId,
      alarmName: currentAlarm.alarmName,
      isRecurring: 1,
      daysOfWeek: [currentAlarm.daysOfWeek],
      route: {
         start_lat: currentAlarm.start_lat,
         start_long: currentAlarm.start_long,
         end_lat: currentAlarm.end_lat,
         end_long: currentAlarm.end_long,
         modeOfTransport: 'Train',
         preferredRoute: 'need_to_figure_out',
         address: {
           start: currentAlarm.start,
           end: currentAlarm.end
         },
         routeSelectedBool: currentAlarm.routeSelectedBool
        //  routeIndex: null
      },
      prepTime: currentAlarm.prepTime,
      arrivalTime: currentAlarm.arrivalTime,
      contacts: [
         {
            user: 56,
            type: 'email'
         }
      ]
    }
  }

	render () {
		return (
      <ScrollView style={styles.window}>
        <TextInput
          onChangeText={(alarmName) => {this.setState({alarmName})}}
          value={this.state.alarmName}
          style={styles.input}
          placeholder="Alarm Name">
        </TextInput>
        <Text style={styles.item}>Arrival Time</Text>
        <DatePickerIOS
          date={new Date(this.state.arrivalTime)}
          mode='time'
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}
          />
        <TextInput
          onChangeText={(prepTime) => {this.setState({prepTime})}}
          value={this.state.prepTime}
          style={styles.input}
          placeholder="Prep time">
        </TextInput>
        <Directions handleChange={this.handleChange} getDuration={this.getDuration} alarmInfo={this.state} />
      </ScrollView>
    )
	}
}

const stateifyDbData = (data) => {
  let route = data.route;
  let newState = Object.assign({}, {
    alarmName: data.alarmName,
    arrivalTime: data.arrivalTime,
    prepTime: data.prepTime.toString(),
    start: route.address.start,
    end: route.address.end,
    start_lat: route.start_lat,
    start_long: route.start_long,
    end_lat: route.end_lat,
    end_long: route.end_long,
    timerId: data.timerId
  })
  return newState;
}


const styles = StyleSheet.create({
  window:{
    borderColor: 'green'
  },
  container: {
   flex: 1,
   paddingTop: 22
  },
  list: {
    padding: 10,
  },
  item: {
    fontSize: 18,
    height: 44,
  },
  input: {
    paddingLeft: 15,
    height: 40,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 7,
    borderColor: 'gray',
    borderWidth: 2
  }
})
