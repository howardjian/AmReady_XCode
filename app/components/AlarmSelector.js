import React from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';

export default function ({alarms, navigation}) {
	console.log('alarm arr?', alarms);
	const alarmInfo = [];
	const alarmKeys = alarms.map((alarm, index) => {
		alarmInfo.push(alarm);
		return {key: index}
	});
	return (
		<View style={styles.container}>
			{
				alarmKeys.length ?
				<FlatList data={alarmKeys}
				renderItem={({item}) => {
					const alarm = alarmInfo[item.key];
					return (
						<Button style={styles.list}
							title={alarm.alarmName}
							onPress={ () => {
								navigation.navigate('alarmDetail', {alarm: alarm, alarmIndex: item.key})
							} }
							accessibilityLabel={`Click to view ${item.key} alarm details`}>
							<Text style={styles.item}>{alarm.alarmName} | {alarm.arrivalTime}</Text>

						</Button>
					)
				}
				} /> : null
			}
		</View>
	)
}

const styles = StyleSheet.create({
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
  }
})
/*
<Text style={styles.item}>{alarm.daysOfWeek ? alarm.daysOfWeek.join(',') : null}</Text>
*/
