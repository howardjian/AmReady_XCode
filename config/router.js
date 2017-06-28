import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native';
import Home from '../app/screens/Home';
import AlarmForm from '../app/screens/AlarmForm';


module.exports = StackNavigator({
	home: {
		screen: Home,
		navigationOptions: ({ navigation }) => ({
			title: 'My Alarms',

			headerRight: <Button title={'+'} onPress={ () =>
				navigation.navigate('alarmDetail', {})
			} />
		})
	},
	alarmDetail: {
		screen: AlarmForm,
		navigationOptions: ({ navigation }) => ({
			title: navigation.state.params.alarmName,
			headerRight: <Button title={'Save'} onPress={ () =>
				navigation.state.params.handleSave() } />

		})
	}
});
