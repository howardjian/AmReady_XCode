import React from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';

export default function ({alarms, navigation, setCurrentAlarm}) {
	const alarmKeys = alarms.map((alarm, index) => {
		return {key: JSON.stringify(alarm)} // need to stringify values because objects look the same to flatlist, and only renders first
	});
	return (
		<View style={styles.container}>
			{
				alarmKeys.length ?
				<FlatList data={alarmKeys}
				renderItem={({item, index}) => {
					const alarm = JSON.parse(item.key);
					return (
						<Button style={styles.list}
							title={alarm.alarmName}
							onPress={ () => {
								setCurrentAlarm(alarm, index);
								navigation.navigate('alarmDetail', {alarm, alarmIndex: index})
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
