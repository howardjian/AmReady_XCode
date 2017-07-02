import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
// import { Container, Content, Card, CardItem, Body } from 'native-base';
import { Container, Content, Button, Text } from 'native-base';


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
								navigation.navigate('alarmDetail', {alarm})
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



// <Container>
// 									<Button>
// 										<Content>
// 											<Card>
// 												<CardItem header>
// 													<Text>NativeBase</Text>
// 												</CardItem>
// 												<CardItem>
// 													<Body>
// 														<Text>
// 															//Your text here
// 														</Text>
// 													</Body>
// 												</CardItem>
// 												<CardItem footer>
// 													<Text>GeekyAnts</Text>
// 												</CardItem>
// 										</Card>
// 										</Content>
// 									</Button>
// 									</Container>



// <Item floatingLabel style={{ width: 340 }}>
//                 <Label style={{color: '#5e5e5e', fontWeight: 'bold'}}>Alarm Name</Label>
//                 <Input
//                  style={{ color: 'white' }}
//                  onChangeText={(alarmName) => {this.setState({alarmName})}}
//                  value={this.state.alarmName}
//                 />
//               </Item>



		// <View style={styles.container}>
		// 	{
		// 		alarmKeys ?
		// 		<FlatList data={alarmKeys}
		// 		renderItem={({item}) => {
		// 			const alarm = alarmInfo[item.key];
		// 			return (
		// 				<Button style={styles.list}
		// 					title={item.key}
		// 					onPress={ () => {
		// 						navigation.navigate('alarmDetail', {alarm: alarm, data:data})
		// 					} }
		// 					accessibilityLabel={`Click to view ${item.key} alarm details`}>
		// 					<Text style={styles.item}>{item.key} | {alarm.arrivalTime}</Text>

		// 				</Button>
		// 			)
		// 		}
		// 		} /> : null
		// 	}
		// </View>



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
