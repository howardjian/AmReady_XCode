import React from 'react';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native';
import Home from '../app/screens/Home';
import AlarmForm from '../app/screens/AlarmForm';
import initialState from '../seed';

class MainNavigator extends React.Component {
	constructor () {
		super();
	}
	componentDidMount () {
		// pull data
		// set state
	}

	render () {
		return (
			StackNavigator({
				home: {
					screen: Home,
					navigationOptions: ({ navigation }) => ({
						title: 'My Alarms',

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
		)
	}
}

const mapStateToProps = ({name, alarms, locations}) => {
	return {
		name,
		alarms,
		locations
	}
}
export default connect(mapStateToProps)(MainNavigator);
