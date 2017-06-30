/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
//var XMLParser = require('react-xml-parser');
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import MainNavigator from './config/router';

export default class project extends Component {
  componentDidMount(){
    fetch('http://web.mta.info/status/serviceStatus.txt')
    .then(info => {
      //let test = XMLParser().parseFromString(info["_bodyInit"]);
      console.error('hi', info["_bodyInit"].replace("\r\n", "").split(" "))
    })
    .catch(err => {
      console.warn(err)
    })
  }
  render() {
    return (
      <MainNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('project', () => project);
