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

export default class extends React.Component {
	constructor () {
		super();

    this.state ={
      date: new Date(),
      alarmName: '',
      start:null,
      end:null,
      daysOfWeek: '',
      start_lat: 37.78825,
      start_long: -122.4324,
      end_lat: 37.78825 ,
      end_long: -122.4324,
      directions:false,
      trainOptions: [],
      routeSelected: false,
      routeIndex: null,
      prepTime: ''
    }
		this.saveDetails = this.saveDetails.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveNewAlarm = this.saveNewAlarm.bind(this);
	}

  handleChange(changedState) {
    let newState = Object.assign({}, this.state, changedState)
    this.setState(newState);
    // console.log('newState', this.state);
    this.saveNewAlarm();
  }

  saveNewAlarm() {
    // 1. Get old alarms
    // 2. convert old alarms to JSON
    // 3. push new alarm to alarms array
    // 4. stringify alarms
    // 5. set item
    AsyncStorage.getItem('alarms', (err, result) => {
      console.log(result);
    })
  }

	saveDetails() {
    // alert('Save Details');
    AsyncStorage.setItem(this.state);
    this.props.navigation.dispatch(NavigationActions.reset(
      {
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'home'})
        ]
      }));
  }



  onDateChange (date) {
    this.setState({date: date});
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  AsyncStorageFormat(){
    const currentAlarm = this.state;
    return {
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
         routeSelected: currentAlarm.routeSelected
        //  routeIndex: null
      },
      prepTime: currentAlarm.prepTime,
      arrivalTime: timeFormat(currentAlarm.arrivalTime),
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
          date={this.state.date}
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
        <Directions handleChange={this.handleChange}/>
      </ScrollView>
    )
	}
}

const timeFormat=(date) =>{
  date = date.split(':');
  let hours = date[0].slice(date[0].length-2,date[0].length);
  let min = date[1];
  return hours+':'+min;
}


const styles = StyleSheet.create({
  window:{
    color: 'green'
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
