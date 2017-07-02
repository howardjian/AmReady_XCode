import React from 'react';
import {
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  DatePickerIOS } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Directions from '../components/Directions';
import {setTimer} from '../features/Audio';
import { stateifyDbData, AsyncStorageFormat } from '../../utils/utils';
import { connect } from 'react-redux';
import { updateAlarm, saveNewAlarm, unselectAlarm } from '../redux';

class AlarmForm extends React.Component  {
	constructor (props) {
		super(props);

    this.state ={
      alarmName: '',
      start:null,
      end:null,
      start_lat: 40.7051,
      start_long: -74.0092,
      end_lat: 40.7051,
      end_long: -74.0092,
      directions:false,
      trainOptions: [],
      routeSelectedBool: false,
      routeIndex: null,
      prepTime: '',
      duration:'',
      arrivalTime: new Date(),
      timerId: null
    }

		this.saveAlarmDetails = this.saveAlarmDetails.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getDuration = this.getDuration.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
	}

  componentWillMount() {
    // let selectedUserData = this.props.navigation.state.params
    if (this.props.currentAlarm.alarmInfo.alarmName) {
      this.setState(stateifyDbData(this.props.currentAlarm.alarmInfo));
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  componentWillUnmount() {
    this.props.unselectAlarm();
  }

  handleChange(changedState) {
    let newState = Object.assign({}, this.state, changedState)
    this.setState(newState);
  }

  // Need to somehow fix this for DRY purposes
  getDuration(duration){
    this.setState({duration})
  }

	saveAlarmDetails() {
    const alarms = this.props.alarms;
    const alarmIndex = this.props.currentAlarm.index;
    const currentAlarm = AsyncStorageFormat(this.state);
    console.warn(typeof alarmIndex, alarmIndex === null );
    if (alarmIndex !== null) {
        console.warn('we are saving!', alarms, currentAlarm, alarmIndex);
        this.props.updateAlarm(alarms, currentAlarm, alarmIndex)
        .then((result) => {
          this.setTimer();
        })
    } else {
        console.warn('bahhhh', alarms, 'INDEX', alarmIndex, 'new alarm',currentAlarm)
        this.props.saveAlarm(alarms, currentAlarm)
        .then((result) => {
          this.setTimer();
        })
    }
  }

  handleSave() {
          // set background timer
      if (!this.state.timerId) {
        const timerId = setTimer(this.state.arrivalTime, +this.state.prepTime, +this.state.duration);
        this.setState({timerId}, () => {
            this.saveAlarmDetails();
        });
        console.warn('CREATED TIMER ID', timerId);
      } else {
        console.warn('TIMER ID', this.state.timerId);
      }
      // this.props.unselectAlarm(); // testing this in componentWillUnmount
      // need to write in case where we are editing an alarm

      console.warn('tis the end', this.props)
      this.navigateHome();
  }

  navigateHome() {
      this.props.navigation.dispatch(NavigationActions.reset(
      {
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'home'})
        ]
      }));
  }

  onDateChange (date) {
    this.setState({arrivalTime: date});
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

const mapStateToProps = ({alarms, currentAlarm}) => {
   return {alarms, currentAlarm}
}

const mapDispatchToProps = (dispatch) => {
   return {
        updateAlarm: (alarms, alarm, alarmIndex) => dispatch(updateAlarm(alarms, alarm, alarmIndex)),
        saveAlarm: (currentAlarms, newAlarm) => dispatch(saveNewAlarm(currentAlarms, newAlarm)),
        unselectAlarm: () => dispatch(unselectAlarm())
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlarmForm);

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
