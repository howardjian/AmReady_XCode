import React from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { FormLabel, Button, Divider, ListItem, List, Card } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

export default function ({data, setData, navigation}) {
	const alarmInfo = {};
	const alarmKeys = data && data.alarms ? data.alarms.map((alarm) => {
		alarmInfo[alarm.alarmName] = alarm;
		return {key: alarm.alarmName}
	}) : null;



	return (

<ScrollView>
									<Divider style={{height: 5, backgroundColor: '#2e2e2e'}}/>

		<View style={styles.window}>
			{
				alarmKeys ?
				<FlatList data={alarmKeys}
				renderItem={({item}) => {
					const alarm = alarmInfo[item.key];
					return (

					<View>
						<Button
							textStyle={{color: '#ADFF2F'}}
							// iconStyle={{color: '#ADFF2F'}}
							// align='left'
							large
							iconLeft
							icon={{name: 'alarm'}}
							title={item.key  + '    |    ' + alarm.arrivalTime }
							// textStyle = {{textAlign: 'left'}}

							onPress={ () => {
								navigation.navigate('alarmDetail', {alarm: alarm, data:data})
							} }

							/>

							<Divider style={{height: 5, backgroundColor: '#2e2e2e'}}/>
					</View>

					)
				}
				} /> : null
			}
		</View>
		</ScrollView>
	)
}



// <ScrollView>
// 		<View style={styles.window}>
// 			{
// 				alarmKeys ?
// 				<FlatList data={alarmKeys}
// 				renderItem={({item}) => {
// 					const alarm = alarmInfo[item.key];
// 					return (

// 					<View>
// 						<Button
// 							// buttonStyle={{borderWidth: 2}}
// 							align='left'
// 							large
// 							iconRight
// 							icon={{name: 'alarm'}}
// 							title={item.key  + '\n' + alarm.arrivalTime }
// 							// textStyle = {{textAlign: 'left'}}

// 							onPress={ () => {
// 								navigation.navigate('alarmDetail', {alarm: alarm, data:data})
// 							} }

// 							/>

// 							<Divider style={{height: 5, backgroundColor: 'white'}}/>
// 					</View>

// 					)
// 				}
// 				} /> : null
// 			}
// 		</View>
// 		</ScrollView>


const styles = StyleSheet.create({
	window: {
		// backgroundColor: 'white'
		backgroundColor: '#2e2e2e'
	},
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
