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
import { Divider, Slider} from 'react-native-elements';
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
    // this.renderHeader = this.renderHeader.bind(this);
    // this.renderContent = this.renderContent.bind(this);
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

	saveAlarmDetails() {
    const alarms = this.props.alarms;
    const alarmIndex = this.props.currentAlarm.index;
    const currentAlarm = AsyncStorageFormat(this.state);
    if (alarmIndex !== null) {
        console.warn('we are saving!', alarms, currentAlarm, alarmIndex);
        this.props.updateAlarm(alarms, currentAlarm, alarmIndex)
        .then((result) => {
          this.setTimer();
        })
    } else {
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
        // need to be able to kill current timer and create a new one
        this.saveAlarmDetails();
        console.warn('TIMER ID', this.state.timerId);
      }
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
              <Item floatingLabel style={{ width: 340, borderColor: '#696969' }}>
                <Label style={{color: '#00BFFF', fontSize: 18}}>Alarm Name</Label>
                <Input
                 style={{ color: 'white' }}
                 onChangeText={(alarmName) => {this.setState({alarmName})}}
                 value={this.state.alarmName}
                />
              </Item>
              <Divider style={{paddingTop: 8, backgroundColor: '#333333'}}/>
              <Label style={{color: '#00BFFF', fontSize: 18, paddingLeft: 15}}>Arrival Time:</Label>




              <DatePickerIOS
                date={new Date(this.state.arrivalTime)}
                mode='time'
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={this.onDateChange}
              />




              <Label style={{color: 'white', fontSize: 18, paddingLeft: 15}}><Label style={{color: '#00BFFF', fontSize: 18}}>Preparation Time:</Label> {this.state.prepTime + ' minutes'}</Label>

              <Slider
                minimumValue={0}
                maximumValue={120}
                step={1}
                thumbTintColor={'#00BFFF'}
                style={{width: 340, alignSelf: 'center'}}
                value={this.state.prepTime}
                onValueChange={(prepTime) => this.setState({prepTime})} />



                 <Directions updateNewState={this.updateNewState} alarmInfo={this.state} />

            </Form>
          </Content>
        </Container>
      </ScrollView>
    )
	}
}

              // <Item floatingLabel style={{ width: 340, borderColor: '#696969' }}>
              //   <Label style={{color: '#00BFFF', fontSize: 18}}>Preparation Time</Label>
              //   <Input
              //    style={{color: 'white' }}
              //    onChangeText={(prepTime) => {this.setState({prepTime})}}
              //    value={this.state.prepTime}
              //   />
              // </Item>
const styles = StyleSheet.create({
  window: { backgroundColor: '#333333' },
  item: { width: 340 },
  label: { color: '#5e5e5e' },
  input: { color: 'white' }
})

//DATE PICKER
  // renderHeader(section) {
  //   return (
  //     <View style={styles.header}>
  //       <Text style={styles.headerText}>{section.title}</Text>
  //     </View>
  //   );
  // }

  // renderContent(section) {
  //   return (
  //     <View style={styles.content}>
  //       <Text>{section.content}</Text>
  //     </View>
  //   );
  // }

// <Accordion
//                 sections={new Date(this.state.arrivalTime)}
//                 renderHeader={this.renderHeader}
//                 renderContent={this.renderContent}
//               />


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
