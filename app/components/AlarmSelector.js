import React from 'react';
import { View, FlatList, StyleSheet, Text, Button, ListView, TouchableHighlight} from 'react-native';
import { connect } from 'react-redux';
import { deleteSelectedAlarm, selectAlarm } from '../redux';
import Swipeout from 'react-native-swipeout';
import { Divider, Slider} from 'react-native-elements';
import {resetAlarm, getEstimatedWakeupTime} from '../features/Timer';
import {getArrivalTimeString} from '../../utils/utils';

class AlarmSelector extends React.Component   {
        constructor (props) {
            super(props);
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
         dataSource: ds.cloneWithRows([])
     };

            this.deleteAlarm = this.deleteAlarm.bind(this);
        }

    componentWillReceiveProps (props) {
       const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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

            const arrivalTimeStr = getArrivalTimeString(getEstimatedWakeupTime(rowData.arrivalTime,
              +rowData.prepTime, +rowData.duration));
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
                            <View style={{ height: 40}}>
                                <Text style={{paddingLeft: 15}}> {rowData.alarmName + ' ' +rowData.daysOfWeek + '' + arrivalTimeStr +' '+ rowData.duration}  </Text>
                            </View>
                            <Divider />
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