import React from 'react';
import { View, StyleSheet, ListView, TouchableHighlight} from 'react-native';
import { connect } from 'react-redux';
import { deleteSelectedAlarm, selectAlarm } from '../redux';
import Swipeout from 'react-native-swipeout';
import { Divider, Slider, Grid, Col, Row, Badge} from 'react-native-elements';
import {resetAlarm, getEstimatedWakeupTime} from '../features/Timer';
import { Container, Content, Button, Text } from 'native-base';

import {getArrivalTimeString} from '../../utils/utils';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class AlarmSelector extends React.Component   {
		constructor (props) {
			super(props);
		    this.state = {
		        dataSource: ds.cloneWithRows(this.props.alarms)
		    };
			this.deleteAlarm = this.deleteAlarm.bind(this);
		}

	componentWillReceiveProps (props) {
		// if (this.state.dataSource._cachedRowCount === 0) 
			this.setState({dataSource: ds.cloneWithRows(props.alarms)});
  	}

  	componentWillMount () {
  		// this.setState({dataSource: ds.cloneWithRows(this.props.alarms)});
  	}

	deleteAlarm(alarm, alarmIndex){
		resetAlarm(alarm.timerId);
		this.props.deleteSelectedAlarm(this.props.alarms, alarmIndex);
	}


renderRow(rowData, rowIndex, index) {
		// if(index === 1) return;
			let swipeBtns = [{
				text: 'Delete',
				backgroundColor: 'red',
				underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
				onPress: () => { this.deleteAlarm(rowData, +index) }
			}];

			let arrivalTimeStr = getArrivalTimeString(getEstimatedWakeupTime(rowData.arrivalTime, +rowData.prepTime, +rowData.route.duration));

			arrivalTimeStr = arrivalTimeStr.split(" ");
			const etaDateStr = getArrivalTimeString(rowData.arrivalTime);

			return (

				<Swipeout right={swipeBtns}
					autoClose={true}
					backgroundColor= 'transparent'>
					<TouchableHighlight
						onPress={() => {
							this.props.selectAlarm(rowData, +index);
							this.props.navigation.navigate('alarmDetail', rowData);
						}} >
						<View style={{ height: 100, backgroundColor: '#575757'}}>
						<Grid >


							<Col size={2}>
							<Row>
								<Text style={{left: 17, paddingTop: 20, paddingBottom: 10, color: '#00BFFF',fontSize: 22}}> {rowData.alarmName}</Text>
								</Row>
								<Row>
								<Text style={{ paddingTop: 6, color: 'white', left: 21}}>{`ETA: ${etaDateStr}`}</Text>
								</Row>
</Col>

								<Divider style={{backgroundColor: '#575757', paddingTop: 21}} />


<Col size={1}>

								<Badge containerStyle={{ marginLeft: 21,  top: 32,  right: 25,  backgroundColor: 'black', borderWidth: 0, borderColor: '#00BFFF' }}>
								<Text style={ { color: 'white', alignContent: 'center', fontFamily: 'Digital Dismay', fontSize: 28 }}>{arrivalTimeStr[0]}</Text>


								</Badge>


</Col>
<Col size={0.5}><Text style={{top: 42,  color:'white', fontSize: 18, left: -19}}>{' ' + arrivalTimeStr[1]}</Text></Col>


							</Grid>
							<Divider style={{backgroundColor: '#333333', paddingBottom: 2}} />
						</View>
					</TouchableHighlight>
				</Swipeout>
			)
	}


	render(){
			return (
					<View style={styles.container}>
						{
							this.props.alarms.length ?
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
		  selectAlarm: (alarm, alarmIndex) => dispatch(selectAlarm(alarm, alarmIndex)),
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
