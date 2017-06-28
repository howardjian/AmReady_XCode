import React from 'react';
import { StyleSheet, Text, View, DatePickerIOS } from 'react-native';
import moment from 'moment';

export default function (props) {
	return (
		<Text>
			{ moment().format('LT') }
			<DatePickerIOS />
		</Text>
	)
}