import React from 'react';
import { Text, View, AsyncStorage } from 'react-native';

export default class Splash extends React.Component {
   constructor () {
      super();
      this.state = {
         'data': {}
      }
   }
   componentDidMount() {
      AsyncStorage.getItem('data').then((value) => {
         this.setState({'data': value});
      });
   }
   setData (value) {
      AsyncStorage.setItem('data', value);
      this.setState({'data': value});
   }
   render() {
      return (
         <View
            data = {this.state.data}
            setData = {this.setData}
         />
      );
   }
}