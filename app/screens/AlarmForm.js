import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Directions from '../components/Directions';
import { setTimer, clearBackgroundTimer } from '../features/Timer';
import { stateifyDbData, AsyncStorageFormat } from '../../utils/utils';
import { connect } from 'react-redux';
import { updateAlarm, saveNewAlarm, unselectAlarm } from '../redux';
import { Divider, Slider} from 'react-native-elements';
import { Container, Content, Form, Item, Input, Label } from 'native-base';
import DatePicker from 'react-native-datepicker';


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
      prepTime: 60,
      duration:'',
      arrivalTime: new Date(),
      timerId: null
    }

		this.saveAlarmDetails = this.saveAlarmDetails.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.updateNewState = this.updateNewState.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
	}

  componentWillMount() {
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
      .then(() => {
          // if there exists a background timer already, clear it and create a new one
          // (technically, this only needs to be done when arrival time, prep time or duration changes, but for simplicity sake,
          // we will reset after each edit)
          if (currentAlarm.timerId) {
              console.warn('resetting the background timer', currentAlarm.timerId);
              clearBackgroundTimer(currentAlarm.timerId);
          }
          const timerId = setTimer(currentAlarm, alarmIndex);
          console.log('timerId', timerId);
          this.setState({timerId}, () => {
              this.props.updateAlarm(alarms, AsyncStorageFormat(this.state), alarmIndex);
              console.warn('CREATED TIMER ID', timerId);
          });
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
              <Item floatingLabel style={{ width: 380, borderColor: '#696969', alignSelf: 'center' }}>
                <Label style={{color: '#00BFFF', fontSize: 24, width: 380}}>Alarm Name</Label>
                <Input
                 style={{ color: 'white' }}
                 onChangeText={(alarmName) => {this.setState({alarmName})}}
                 value={this.state.alarmName}
                />
              </Item>

              <Divider style={{paddingTop: 8, backgroundColor: '#333333'}}/>
              <Label style={{color: '#00BFFF', fontSize: 24, paddingLeft: 15}}>Arrival Time:</Label>

              <Divider style={{paddingTop: 8, backgroundColor: '#333333'}}/>

              <DatePicker
                style={{width: 340, alignSelf: 'center'}}
                date={new Date(this.state.arrivalTime)}
                mode="time"
                format="h:mm A"
                is24Hour={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minuteInterval={10}
                showIcon={false}
                customStyles={{
                  dateInput: {


                    borderTopColor: '#333333', borderLeftColor: '#333333', borderRightColor: '#333333',
                    width: 380
                  },
                  dateText: {
                    fontFamily: 'Digital Dismay',
                    fontSize: 30,
                    letterSpacing: 3,
                    paddingLeft: 15,

                    color: 'white',
                    input: 'Arraival'
                  },
                  DatePickerCon: {backgroundColor: 'red'},
                 btnTextCancel: { color: 'red'}
                }}
                onDateChange={this.onDateChange}
              />

              <Divider style={{paddingTop: 8, backgroundColor: '#333333'}} />

              <Label style={{color: 'white', fontSize: 24, paddingLeft: 15}}><Label style={{color: '#00BFFF', fontSize: 24}}>Preparation Time:</Label> <Label style={{fontFamily: 'Digital Dismay', letterSpacing:3, fontSize: 26}}>{+this.state.prepTime}</Label> minutes</Label>

              <Slider
                minimumValue={0}
                maximumValue={120}
                step={1}
                thumbTintColor={'#00BFFF'}
                style={{width: 380, alignSelf: 'center'}}
                value={+this.state.prepTime}
                onValueChange={(prepTime) => this.setState({prepTime})} />



                 <Directions updateNewState={this.updateNewState} alarmInfo={this.state} />

            </Form>
          </Content>
        </Container>
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
