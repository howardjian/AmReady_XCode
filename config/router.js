import React from 'react';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native';
import Home from '../app/screens/Home';
import AlarmForm from '../app/screens/AlarmForm';
import { getAlarmsFromAsyncStorage, createAlarmsInAsyncStorage } from '../app/redux';

class MainNavigator extends React.Component {

	componentDidMount () {
		this.props.seedDatabase(require('../seed').alarms); // only need to do this once for seeding async storage
		// this.props.getAlarms();
	}

	render () {
		return <Navigator />
	}
}

const Navigator = StackNavigator({
	home: {
		screen: Home,
		navigationOptions: ({ navigation }) => ({
			title: 'My Alarms',
			params: navigation.state,
			headerRight: <Button title={'+'} onPress={ () =>
				navigation.navigate('alarmDetail', {alarms: this.state.alarms})
			} />
		})
	},
	alarmDetail: {
		screen: AlarmForm,
		navigationOptions: ({ navigation }) => ({
			title: navigation.state.params.alarmName,
			params: navigation.state,
			headerRight: <Button title={'Save'} onPress={ () =>
				navigation.state.params.handleSave() } />
		})
	}
})

const mapStateToProps = ({name, alarms, locations}) => {
	return {
		name,
		alarms,
		locations
	}
}

const mapDispatchToProps = (dispatch) => ({
	getAlarms: () => dispatch(getAlarmsFromAsyncStorage()),
	seedDatabase: (alarms) => dispatch(createAlarmsInAsyncStorage(alarms))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
