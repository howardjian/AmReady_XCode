import React from 'react';
import { View, FlatList, StyleSheet, ListView, TouchableHighlight, Divider, TextInput, Text, Button} from 'react-native';
import { connect } from 'react-redux';
import { updateAlarm, deleteSelectedAlarm, unselectAlarm } from '../redux';
import Swipeout from 'react-native-swipeout';

// import { Container, Content, Card, CardItem, Body } from 'native-base';
// import { getAlarmsFromAsyncStorage, createAlarmsInAsyncStorage } from '../redux';
// import { Container, Content, Button, Text } from 'native-base';
// import { List, ListItem } from 'react-native-elements'



class AlarmSelector extends React.Component   {
		constructor (props) {
			super(props);
			this.state = {
				alarms: this.props.alarms
			}

			this.deleteAlarm = this.deleteAlarm.bind(this);
		}

	componentWillMount(){

	}

	componentDidMount () {

	}

	  // renderRow(rowData) {
    // let swipeBtns = [{
    //   text: 'Delete',
    //   backgroundColor: 'red',
    //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
    //   onPress: () => { this.deleteNote(rowData) }
    // }];

    // return (
    //   <Swipeout right={swipeBtns}
    //     autoClose='true'
    //     backgroundColor= 'transparent'>
    //     <TouchableHighlight
    //       underlayColor='rgba(192,192,192,1,0.6)'
    //       onPress={this.viewNote.bind(this, rowData)} >
    //       <View>
    //         <View style={styles.rowContainer}>
    //           <Text style={styles.note}> {rowData} </Text>
    //         </View>
    //         <Divider />
    //       </View>
    //     </TouchableHighlight>
    //   </Swipeout>
    // )
		// }

	deleteAlarm(){

	}

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
		// 	 return (
    //   <View style={styles.container}>

    //     <ListView
    //       dataSource={this.state.dataSource}
    //       renderRow={this.renderRow.bind(this)} />
    //   </View>
    // )

		}
  }


const mapStateToProps = ({alarms, currentAlarm}) => {
   return {alarms, currentAlarm}
}

const mapDispatchToProps = (dispatch) => {
   return {
		 		deleteSelectedAlarm: (currentAlarms, alarmIndex) => dispatch(deleteSelectedAlarm)
        // updateAlarm: (alarms, alarm, alarmIndex) => dispatch(updateAlarm(alarms, alarm, alarmIndex)),
        // saveAlarm: (currentAlarms, newAlarm) => dispatch(saveNewAlarm(currentAlarms, newAlarm)),
        // unselectAlarm: () => dispatch(unselectAlarm())
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



// 		render(){
// 			console.warn("render", this.state.alarms)
// 			// const alarms  = this.props.alarms ? this.setState({alarms: this.props.alarms}) : null;
// 			// this.props.alarms ? this.setState({alarms: this.props.alarms}) : '';
// 			const alarmInfo = {};
// 			const alarmKeys = this.props.alarms && this.props.alarms ? this.props.alarms.map((alarm) => {
// 				console.warn("A", alarm)
// 				alarmInfo[alarm.alarmName] = alarm;
// 				return {key: alarm.alarmName}
// 			}) : null;

// 			return (


// 					<View style={styles.container}>
// 			{
// 				alarmKeys ?
// 				<FlatList data={alarmKeys}
// 				renderItem={({item}) => {
// 					const alarm = alarmInfo[item.key];
// 					return (
// 						<Button style={styles.list}
// 							title={item.key}
// 							onPress={ () => {
// 								navigation.navigate('alarmDetail', {alarm: alarm, data:data})
// 							} }
// 							accessibilityLabel={`Click to view ${item.key} alarm details`}>
// 							<Text style={styles.item}>{item.key} | {alarm.arrivalTime}</Text>

// 						</Button>
// 					)
// 				}
// 				} /> : null
// 			}
// 		</View>
// 		)}
// }


// const mapDispatchToProps = (dispatch) => ({
// 	getAlarms: () => dispatch(getAlarmsFromAsyncStorage()),
// 	seedDatabase: (alarms) => dispatch(createAlarmsInAsyncStorage(alarms))
// })


// const styles = StyleSheet.create({
//   container: {
//    flex: 1,
//    paddingTop: 22
//   },
//   list: {
//     padding: 10,
//   },
//   item: {
//     fontSize: 18,
//     height: 44,
//   }
// })
