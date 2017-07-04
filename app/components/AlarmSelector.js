import React from 'react';
import { View, FlatList, StyleSheet, ListView, TouchableHighlight, Divider, TextInput, Text, Button} from 'react-native';
import { connect } from 'react-redux';
import { updateAlarm, deleteSelectedAlarm, unselectAlarm } from '../redux';
import Swipeout from 'react-native-swipeout';

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

		}
  }


const mapStateToProps = ({alarms, currentAlarm}) => {
   return {alarms, currentAlarm}
}

const mapDispatchToProps = (dispatch) => {
   return {
		 		deleteSelectedAlarm: (currentAlarms, alarmIndex) => dispatch(deleteSelectedAlarm)
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
