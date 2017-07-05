import { AsyncStorage } from 'react-native';

/* ------------------------------- ACTIONS ------------------------------- */
const SET_ALARMS = 'SET_ALARMS';
const SET_CURRENT_ALARM = 'SET_CURRENT_ALARM';
const UNSET_CURRENT_ALARM = 'UNSET_CURRENT_ALARM';
const SET_ALARM_RINGING = 'SET_ALARM_RINGING';
const UNSET_ALARM_RINGING = 'UNSET_ALARM_RINGING';

/* --------------------------- ACTION-CREATORS --------------------------- */
const setAlarms = (alarms) => ({ type: SET_ALARMS, alarms });
const setCurrentAlarm = (alarm, alarmIndex) => ({ type: SET_CURRENT_ALARM, alarm, alarmIndex });
const unsetCurrentAlarm = () => ({ type: UNSET_CURRENT_ALARM });
const setAlarmRinging = (alarm, alarmIndex) => ({ type: SET_ALARM_RINGING, alarm, alarmIndex });
const unsetAlarmRinging = () => ({ type: UNSET_ALARM_RINGING });

/* ------------------------------- REDUCERS ------------------------------- */
const dummyAlarmObj = {
	index: null,
	alarmInfo: {}
}

const dummyAlarmObjCreator = () => Object.assign({}, dummyAlarmObj);

const initialState = {
	name: '',
	alarms: [],
	locations: [],
	currentAlarm: dummyAlarmObjCreator(),
	alarmRinging: dummyAlarmObjCreator()
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state);
	newState.alarmRinging = Object.assign({}, newState.alarmRinging);
	newState.currentAlarm = Object.assign({}, newState.currentAlarm);
	switch (action.type) {
		case SET_ALARMS:
			newState.alarms = action.alarms;
			break;
		case SET_CURRENT_ALARM:
			newState.currentAlarm.alarmInfo = action.alarm;
			newState.currentAlarm.index = action.alarmIndex;
			break;
		case UNSET_CURRENT_ALARM:
			newState.currentAlarm = dummyAlarmObjCreator();
			break;
		case SET_ALARM_RINGING:
			newState.alarmRinging.alarmInfo = action.alarm;
			newState.alarmRinging.index = action.alarmIndex;
			break;
		case UNSET_ALARM_RINGING:
			newState.alarmRinging = dummyAlarmObjCreator();
			break;
		default:
			break;
	}
	return newState;
}

/* ------------------------------ DISPATCHERS ------------------------------ */
export const getAlarmsFromAsyncStorage = () => {
	return dispatch => {
		AsyncStorage.getItem('alarms')
		.then((alarms) => {
			alarms = alarms || '[]';
        	dispatch(setAlarms(JSON.parse(alarms)));
    	})
    	.catch(console.error.bind(console));
	}
}

export const saveNewAlarm = (currentAlarms, newAlarm) => {
	currentAlarms.push(newAlarm);
	return !currentAlarms.length ?
		createAlarmsInAsyncStorage(currentAlarms) : updateAlarmsInAsyncStorage(currentAlarms);
}

export const updateAlarm = (currentAlarms, updatedAlarm, alarmIndex) => {
	currentAlarms[alarmIndex] = updatedAlarm;
	return updateAlarmsInAsyncStorage(currentAlarms);
}

export const selectAlarm = (alarm, alarmIndex) => {
	return setCurrentAlarm(alarm, alarmIndex);
}

export const unselectAlarm = () => {
	return unsetCurrentAlarm();
}

export const deleteSelectedAlarm = (currentAlarms, alarmIndex) => {
	console.log('1',currentAlarms);
	// currentAlarms = JSON.parse(currentAlarms)
	// console.log('2',currentAlarms);
	const updatedAlarms = currentAlarms.filter((alarm, index) => index !== alarmIndex);
	console.log("updateAlarms", updatedAlarms);
	return updateAlarmsInAsyncStorage(updatedAlarms);
}

export const createAlarmsInAsyncStorage = (alarms) => {
	return dispatch => {
		return AsyncStorage.setItem('alarms', JSON.stringify(alarms), (err) => {
	      if (err){
	        console.error(err);
	      }
	      dispatch(setAlarms(alarms));
	    })
	}
}

const updateAlarmsInAsyncStorage = (alarms) => {
	return dispatch => {
		return AsyncStorage.setItem('alarms', JSON.stringify(alarms), (err) => {
	      if (err){
	        console.error(err);
	      }
	      dispatch(setAlarms(alarms));
	    })
	}
}

export const triggerAlarm = (alarm, alarmIndex) => {
	return setAlarmRinging(alarm, alarmIndex);
}

export const silenceAlarm = () => {
	return unsetAlarmRinging();
}
