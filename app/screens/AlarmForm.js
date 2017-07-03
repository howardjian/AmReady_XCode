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
import { Divider } from 'react-native-elements';
import { Container, Content, Form, Item, Input, Label } from 'native-base';

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
      prepTime: '',
      duration:'',
      arrivalTime: new Date(),
      timerId: null
    }

		this.saveAlarmDetails = this.saveAlarmDetails.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    // console.log(this.props);
    // console.log(this.state);
  }

  componentWillUnmount() {
    this.props.unselectAlarm();
  }

  updateNewState(changedState) {
    let newState = Object.assign({}, this.state, changedState)
    this.setState(newState);
  }

	saveAlarmDetails(alarms, currentAlarm, alarmIndex) {
    if (alarmIndex !== null) {
        return this.props.updateAlarm(alarms, currentAlarm, alarmIndex)
    } else {
        return this.props.saveAlarm(alarms, currentAlarm)
    }
  }

  handleSave() {
      const alarms = this.props.alarms;
      const alarmIndex = this.props.currentAlarm.index;
      const currentAlarm = AsyncStorageFormat(this.state);
      // save in async storage
      this.saveAlarmDetails(alarms, currentAlarm, alarmIndex)
      .then((result) => {
          console.log('RESULT', result);
          if (!currentAlarm.timerId) {
              const timerId = setTimer(currentAlarm, alarmIndex);
              this.setState({timerId}, () => {
                  this.props.updateAlarm(alarms, currentAlarm, alarmIndex);
                  console.warn('CREATED TIMER ID', timerId);
              });
          } else {
              console.warn('TIMER ID', this.state.timerId);
          }
      })
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
      <ScrollView>
        <Container style={{backgroundColor: '#333333'}}>
          <Content>
            <Form>
              <Item floatingLabel style={{ width: 340 }}>
                <Label style={{color: '#5e5e5e', fontWeight: 'bold'}}>Alarm Name</Label>
                <Input
                 style={{ color: 'white' }}
                 onChangeText={(alarmName) => {this.setState({alarmName})}}
                 value={this.state.alarmName}
                />
              </Item>
              <Divider style={{paddingTop: 15, backgroundColor: '#333333'}}/>
              <Text style={{color: '#5e5e5e', fontSize: 18, paddingLeft: 15}}>Arrival Time</Text>
              <DatePickerIOS
                date={new Date(this.state.arrivalTime)}
                mode='time'
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={this.onDateChange}
              />
              <Item floatingLabel style={{ width: 340 }}>
                <Label style={{color: '#5e5e5e'}}>Preparation Time</Label>
                <Input
                 style={{color: 'white' }}
                 onChangeText={(prepTime) => {this.setState({prepTime})}}
                 value={this.state.prepTime}
                />
              </Item>

              <Divider style={{paddingTop: 15, backgroundColor: '#333333'}}/>
              <Directions updateNewState={this.updateNewState} alarmInfo={this.state} />

            </Form>
          </Content>
        </Container>
      </ScrollView>
    )
	}
}

const styles = StyleSheet.create({
  window: { backgroundColor: '#333333' },
  item: { width: 340 },
  label: { color: '#5e5e5e' },
  input: { color: 'white' }
})

// <ScrollView style={styles.window}>
//         <FormInput
//           onChangeText={(alarmName) => {this.setState({alarmName})}}
//           value={this.state.alarmName}
//           // style={styles.input}
//           placeholder="Alarm Name">
//         </FormInput>
//         <Text style={styles.item}>Arrival Time</Text>
//         <DatePickerIOS
//           date={new Date(this.state.arrivalTime)}
//           mode='time'
//           timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
//           onDateChange={this.onDateChange}
//           />
//         <TextInput
//           onChangeText={(prepTime) => {this.setState({prepTime})}}
//           value={this.state.prepTime}
//           style={styles.input}
//           placeholder="Prep time">
//         </TextInput>
//         <Directions handleChange={this.handleChange} getDuration={this.getDuration} alarmInfo={this.state} />
//       </ScrollView>


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
