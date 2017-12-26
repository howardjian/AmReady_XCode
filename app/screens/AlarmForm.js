import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Directions from '../components/Directions';
import { setTimer, clearBackgroundTimer } from '../features/Timer';
import { stateifyDbData, AsyncStorageFormat } from '../../utils/utils';
import { connect } from 'react-redux';
import { updateAlarm, saveNewAlarm, unselectAlarm, updateAlarmTimer } from '../redux';
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
			start_lat: 40.702794,
			start_long: -73.990672,
      end_lat: 40.7051,
      end_long: -73.990672,
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
  dateTimeConverter(){
    const arrvialFormat = this.state.arrivalTime.split(":");
    const hours = arrvialFormat[0];
    let pm = false;
    if(arrvialFormat[1].includes("PM")){
      pm = true;
    }

    const mins = arrvialFormat[1].replace("AM","").replace("PM","");

    const newDate = new Date();
    if(pm) {
      if(hours === "12") {
        newDate.setHours(hours);
      } else {
        newDate.setHours(String(12+parseInt(hours)));
      }
    } else {
      if(hours === "12") {
        newDate.setHours("00");
      } else {
        newDate.setHours(hours);
      }
    }
    newDate.setMinutes(mins);
    return newDate;
  }

  handleSave() {
    const alarms = this.props.alarms;
    const alarmIndex = this.props.currentAlarm.index;
    let currentAlarm;
    if(typeof this.state.arrivalTime != "object"){
      this.state.arrivalTime  = this.dateTimeConverter();
      currentAlarm = AsyncStorageFormat(this.state);
    } else {
      currentAlarm = AsyncStorageFormat(this.state);
    }

    // save in async storage
    this.saveAlarmDetails(alarms, currentAlarm, alarmIndex)
    .then(() => {
      // if there exists a background timer already, clear it and create a new one
      // (technically, this only needs to be done when arrival time, prep time or duration changes, but for simplicity sake,
      // we will reset after each edit)
      if (currentAlarm.timerId) {
        clearBackgroundTimer(currentAlarm.timerId);
      }
      const timerId = setTimer(currentAlarm, alarmIndex, updateAlarmTimer);
      this.setState({timerId}, () => {
        this.props.updateAlarm(alarms, AsyncStorageFormat(this.state), alarmIndex);
      });
    })
    this.navigateHome();
  }

  navigateHome() {
    this.props.navigation.dispatch(NavigationActions.reset({
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
              <Item floatingLabel style={{ width: 383, borderColor: '#696969' }}>
                <Label style={{color: '#00BFFF', fontSize: 24, width: 380}}>Alarm Name</Label>
                <Input
                 style={{ color: 'white', width: 380 }}
                 onChangeText={(alarmName) => {this.setState({alarmName})}}
                 value={this.state.alarmName}
                />
              </Item>

              <Divider style={{paddingTop: 12, backgroundColor: '#333333'}}/>

              <Label style={{color: '#00BFFF', fontSize: 24, paddingLeft: 15}}>Arrival Time:</Label>

              <Divider style={{paddingTop: 12, backgroundColor: '#333333'}}/>

              <DatePicker
                style={{width: 380, alignSelf: 'center'}}
                date={this.state.arrivalTime}
                mode="time"
                format="h:mm A"
                is24Hour={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minuteInterval={1}
                showIcon={false}
                customStyles={{
                  dateInput: {
                    width: 380,
                    borderBottomColor: '#696969',
                    borderTopColor: '#333333',
                    borderLeftColor: '#333333',
                    borderRightColor: '#333333'
                  },
                  dateText: {
                    fontFamily: 'Digital Dismay',
                    fontSize: 26,
                    letterSpacing: 2,
                    paddingLeft: 15,
                    color: 'white',
                  },
                  btnTextText: {
                    paddingLeft: 15
                  }
                }}
                onDateChange={this.onDateChange}
              />

              <Divider style={{paddingTop: 8, backgroundColor: '#333333'}} />

              <Label style={{color: 'white', fontSize: 24, paddingLeft: 15}}>
								<Label style={{color: '#00BFFF', fontSize: 24}}>Preparation Time:
								</Label>
								<Label style={{fontFamily: 'Digital Dismay', letterSpacing:3, fontSize: 26}}>{+this.state.prepTime}
								</Label> minutes
							</Label>

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
	  unselectAlarm: () => dispatch(unselectAlarm()),
	  updateAlarmTimer: (oldTimerId, newTimerId) => dispatch(updateAlarmTimer(oldTimerId, newTimerId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AlarmForm);
