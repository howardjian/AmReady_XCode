/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import MainNavigator from './config/router';

export default class project extends Component {
  render() {
    return (
      <MainNavigator />
    );
  }
}

AppRegistry.registerComponent('project', () => project);
