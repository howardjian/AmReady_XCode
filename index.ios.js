import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import MainNavigator from './config/router';
import store from './app/store';

export default class project extends Component {
  render() {
    return (
    	<Provider store={store}>
      	<MainNavigator />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('project', () => project);
