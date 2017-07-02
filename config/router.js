import React from 'react';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import { Button } from 'react-native';
import Home from '../app/screens/Home';
import AlarmForm from '../app/screens/AlarmForm';
import { getAlarmsFromAsyncStorage, createAlarmsInAsyncStorage, selectAlarm, updateAlarm, createAlarm } from '../app/redux';

class MainNavigator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount () {
		// this.props.seedDatabase(require('../seed').alarms); // only need to do this once for seeding async storage
		this.props.getAlarms();
	}

	render () {
		return <Navigator screenProps={{...this.props}} />
	}
}

const Navigator = StackNavigator({
	home: {
		screen: Home,
		navigationOptions: ({navigation}) => ({
			title: 'My Alarms',
			headerRight: <Button title={'+'} onPress={ () =>
				navigation.navigate('alarmDetail')
			} />
		})
	},
	alarmDetail: {
		screen: AlarmForm,
		navigationOptions: ({ navigation, screenProps }) => ({
			title: navigation.state.params.alarm.alarmName,
			headerRight: <Button title={'Save'} onPress={ () => {
				navigation.state.params.handleSave();
			}} />
		})
	}
})

const mapStateToProps = ({name, alarms, locations, currentAlarm}) => {
	return {
		name,
		alarms,
		locations,
		currentAlarm
	}
}

const mapDispatchToProps = (dispatch) => ({
	getAlarms: () => dispatch(getAlarmsFromAsyncStorage()),
	setCurrentAlarm: (alarm, alarmIndex) => dispatch(selectAlarm(alarm, alarmIndex)),
	seedDatabase: (alarms) => dispatch(createAlarmsInAsyncStorage(alarms)),
	updateAlarm: (alarms, alarm, alarmIndex) => dispatch(updateAlarm(alarms, alarm, alarmIndex)),
	createAlarm: (alarm) => dispatch(createAlarm(alarm))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
