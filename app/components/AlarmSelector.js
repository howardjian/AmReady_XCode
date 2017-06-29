import React from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';

export default function ({data, setData, navigation}) {
	const alarmInfo = {};
	const alarmKeys = data && data.alarms ? data.alarms.map((alarm) => {
		alarmInfo[alarm.alarmName] = alarm;
		return {key: alarm.alarmName}
	}) : null;
	return (
		<View style={styles.container}>
			{
				alarmKeys ?
				<FlatList data={alarmKeys}
				renderItem={({item}) => {
					const alarm = alarmInfo[item.key];
					return (
						<Button style={styles.list}
							title={item.key}
							onPress={ () => {
								navigation.navigate('alarmDetail', alarm)
							} }
							accessibilityLabel={`Click to view ${item.key} alarm details`}>
							<Text style={styles.item}>{item.key} | {alarm.arrivalTime}</Text>
							<Text style={styles.item}>{alarm.daysOfWeek.join(', ')}</Text>
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
