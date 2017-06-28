import React from 'react';
import {
  AsyncStorage,
  Text,
  TextInput,
  View,
  FlatList,
  StyleSheet,
  Button,
  DatePickerIOS } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Directions from '../components/Directions';

export default class extends React.Component {
	constructor () {
		super();

    this.state ={
      date: new Date()
    }
		this.saveDetails = this.saveDetails.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
	}

	saveDetails() {
        // alert('Save Details');
        this.props.navigation.dispatch(NavigationActions.reset(
         {
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'home'})
            ]
          }));
  }

  onDateChange (date) {
    this.setState({date: date});
  }


    componentDidMount() {
      this.props.navigation.setParams({ handleSave: this.saveDetails });
    }

	render () {
		return (
      <View style={styles.window}>
        <Text style={styles.item}>Arrival Time</Text>
        <DatePickerIOS
          date={this.state.date}
          mode='time'
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}
          />
        <TextInput style={styles.input} placeholder=" Prep time"></TextInput>
        <Directions/>
      </View>
    )


	}
}


const styles = StyleSheet.create({
  window:{
    color: 'green'
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
  },
  input: {
    height: 40,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 7,
    borderColor: 'gray',
    borderWidth: 2
  }
})
