import React from 'react';
import { View, FlatList, StyleSheet, ListView, TouchableHighlight} from 'react-native';
import { connect } from 'react-redux';
import { deleteSelectedAlarm, selectAlarm } from '../redux';
import Swipeout from 'react-native-swipeout';
import { Divider, Slider, Grid, Col, Button, Text} from 'react-native-elements';
import {resetAlarm} from '../features/Audio';

import {getArrivalTimeString} from '../../utils/utils';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class AlarmSelector extends React.Component   {
		constructor (props) {
			super(props);
      this.state = {
          dataSource: ds.cloneWithRows([])
      };

			this.deleteAlarm = this.deleteAlarm.bind(this);
		}

	componentWillReceiveProps (props) {
       
        const alarmKeys = props.alarms.map((alarm, index) => {
            return alarm; // need to stringify values because objects look the same to flatlist, and only renders first
        });
        this.setState({dataSource: ds.cloneWithRows(alarmKeys)});
    }


	deleteAlarm(alarm, alarmIndex){

		resetAlarm(alarm.timerId);

		this.props.deleteSelectedAlarm(this.props.alarms, alarmIndex);
	}


renderRow(rowData, rowIndex, index) {
			let swipeBtns = [{
				text: 'Delete',
				backgroundColor: 'red',
				underlayColor: 'rgba(0, 0, 0, 1, 0.6)',

				onPress: () => { this.deleteAlarm(rowData, +index) }
			}];

			const arrivalTimeStr = getArrivalTimeString(rowData.arrivalTime);

			return (

				<Swipeout right={swipeBtns}
					autoClose='true'
					backgroundColor= 'transparent'>
					<TouchableHighlight
						underlayColor='rgba(192,192,192,1,0.6)'
						onPress={() => {
							this.props.selectAlarm(rowData, +index);
							this.props.navigation.navigate('alarmDetail', rowData);
						}} >
						<View>
							<View style={{ height: 100, backgroundColor: '#575757'}}>

								<Text style={{paddingLeft: 15, paddingTop: 21, paddingBottom: 3, color: '#00BFFF', fontSize: 22}}> {rowData.alarmName}</Text>
								<Text style={{paddingLeft: 15, paddingTop: 3, color: 'white'}}> {  'Mon, Tue, Wed'}  </Text>
								<Text  style={{paddingLeft: 15, paddingTop: 3, color: 'white'}}>{ ' ' + arrivalTimeStr + ' ' + rowData.duration}</Text>
							</View>
							<Divider style={{backgroundColor: '#333333', paddingBottom: 2}} />
						</View>
					</TouchableHighlight>
				</Swipeout>
			)
	}



	render(){
			const alarmKeys = this.props.alarms.map((alarm, index) => {
				return {key: JSON.stringify(alarm)} // need to stringify values because objects look the same to flatlist, and only renders first
			});


			return (

					<View style={styles.container}>
						{
							alarmKeys.length ?
							<ListView
								dataSource={this.state.dataSource}
								renderRow={this.renderRow.bind(this) }
							/>
							 : null
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
		deleteSelectedAlarm: (currentAlarms, alarmIndex) => dispatch(deleteSelectedAlarm(currentAlarms, alarmIndex)),
		selectAlarm: (alarm, alarmIndex) => dispatch(selectAlarm(alarm, alarmIndex))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlarmSelector);

let styles = StyleSheet.create({
  container: {
    // paddingTop: 25,
    flex: 1,
		backgroundColor: '#333333'
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




