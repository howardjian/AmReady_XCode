import React from 'react';
import { AsyncStorage, View } from 'react-native';
import AlarmSelector from '../components/AlarmSelector';
import initialState from '../../seed';
import Clock from '../components/Clock';

export default class Home extends React.Component {
   constructor () {
      super();
      this.state = {
         data: initialState
      }
   }
   componentWillMount () {
      this.setData(this.state.data); // use this while testing to initialize local storage
   }

   componentDidMount() {
      AsyncStorage.getItem('data').then((value) => {
         this.setState({data: value});
      });
   }

   setData (value) {
      AsyncStorage.setItem('data', value);
      this.setState({data: value});
   }

   render() {
      return (
         <View>
            {JSON.parse(this.state.data).alarms.map(alarm => (
               <Clock 
                  arrivalTime={alarm.arrivalTime}
                  prepTime={alarm.prepTime}
                  duration={alarm.route.duration}
                />
               )
            )}
            <AlarmSelector
               data = {JSON.parse(this.state.data)}
               setData = {this.setData}
               navigation = {this.props.navigation}
            />
         </View>
      );
      // return <Clock />
   }
}
