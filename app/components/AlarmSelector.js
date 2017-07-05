import React from 'react';
import { View, FlatList, StyleSheet, Text, Button, ListView} from 'react-native';
import { connect } from 'react-redux';
import { deleteSelectedAlarm, selectAlarm } from '../redux';
import Swipeout from 'react-native-swipeout';
import { Divider, Slider} from 'react-native-elements';
import {resetAlarm} from '../features/Audio';

class AlarmSelector extends React.Component   {
		constructor (props) {
			super(props);
			this.state = {
				alarms: this.props.alarms
			}

			this.deleteAlarm = this.deleteAlarm.bind(this);
			// this.renderRow = this.renderRow.bind(this);
			// this.viewNote = this.viewNote.bind(this);
		}

	componentWillMount(){

	}

	componentDidMount () {

	}

	deleteAlarm(alarm, alarmIndex){
		console.log("AL", this.props.alarms)
		console.log("AL2", JSON.stringify(this.props.alarms));
		resetAlarm(alarm.timerId);

		return this.props.deleteSelectedAlarm(this.props.alarms, alarmIndex);
	}

/*

*/


	render(){
			const alarmKeys = this.props.alarms.map((alarm, index) => {
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
										<View>
									<Button style={styles.list}
										title={alarm.alarmName}
										onPress={ () => {
											this.props.selectAlarm(alarm, index);
											this.props.navigation.navigate('alarmDetail', {alarm})
										} }
										accessibilityLabel={`Click to view ${item.key} alarm details`}>
										<Text style={styles.item}>{alarm.alarmName} | {alarm.arrivalTime}</Text>

									</Button>
									<Button onPress={() => this.deleteAlarm(alarm, index)} title='Del'/>
									</View>
								)
							}
							} /> : null
						}
					</View>


			)
	}
  }

	// <View style={styles.container}>
	// 					{
	// 						alarmKeys.length ?
	// 						<FlatList data={alarmKeys}
	// 						renderItem={({item, index}) => {
	// 							const alarm = JSON.parse(item.key);
	// 							return (
	// 								<Button style={styles.list}
	// 									title={alarm.alarmName}
	// 									onPress={ () => {
	// 										this.props.selectAlarm(alarm, index);
	// 										this.props.navigation.navigate('alarmDetail', {alarm})
	// 									} }
	// 									accessibilityLabel={`Click to view ${item.key} alarm details`}>
	// 									<Text style={styles.item}>{alarm.alarmName} | {alarm.arrivalTime}</Text>

	// 								</Button>
	// 							)
	// 						}
	// 						} /> : null
	// 					}
	// 				</View>





// <View style={styles.container}>
// 						{
// 							alarmKeys.length ?
// 							<ListView
// 								dataSource={alarmKeys}
// 								renderRow={this.renderRow(item) }/>


// 							 : null
// 			}
// 					</View> )





const mapStateToProps = ({alarms, currentAlarm}) => {
   return {alarms, currentAlarm}
}

const mapDispatchToProps = (dispatch) => {
   return {
		deleteSelectedAlarm: (currentAlarms, alarmIndex) => dispatch(deleteSelectedAlarm(currentAlarms, alarmIndex)),
		selectAlarm: (alarm, alarmIndex) => dispatch(selectAlarm(alarm, alarmIndex))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlarmSelector);

let styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1,
  },
  titleText: {
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 1
  },
  noteText: {
    padding: 10,
    flex: 18
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



// renderRow(rowData) {
// 			let swipeBtns = [{
// 				text: 'Delete',
// 				backgroundColor: 'red',
// 				underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
// 				onPress: () => { this.deleteNote(rowData) }
// 			}];

// 				const alarm = JSON.parse(rowData.key)
// 			return (

// 				<Swipeout right={swipeBtns}
// 					autoClose='true'
// 					backgroundColor= 'transparent'>
// 					<TouchableHighlight
// 						underlayColor='rgba(192,192,192,1,0.6)'
// 						onPress={this.props.selectAlarm(alarm, alarm.index)} >
// 						<View>
// 							<View style={{ height: 40}}>
// 								<Text style={{paddingLeft: 15}}> {alarm.alarmName} </Text>
// 							</View>
// 							<Divider />
// 						</View>
// 					</TouchableHighlight>
// 				</Swipeout>
// 			)
// 	}


//   viewNote(rowData) {
//     this.props.navigator.push({
//       title: 'The Note',
//       component: ViewNote,
//       passProps: {
//         noteText: rowData,
//         noteId: this.noteId(rowData),
//       }
//     });
//   }

