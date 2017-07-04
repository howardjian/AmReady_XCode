import { AsyncStorage } from 'react-native';

/* ------------------------------- ACTIONS ------------------------------- */
export const SET_ALARMS = 'SET_ALARMS';
export const SET_CURRENT_ALARM = 'SET_CURRENT_ALARM';
export const UNSET_CURRENT_ALARM = 'UNSET_CURRENT_ALARM';

/* --------------------------- ACTION-CREATORS --------------------------- */
export const setAlarms = (alarms) => ({ type: SET_ALARMS, alarms });
export const setCurrentAlarm = (alarm, alarmIndex) => ({ type: SET_CURRENT_ALARM, alarm, alarmIndex });
export const unsetCurrentAlarm = () => ({ type: UNSET_CURRENT_ALARM });

/* ------------------------------- REDUCERS ------------------------------- */
const initialState = {
	name: '',
	alarms: [],
	locations: [],
	currentAlarm: {
		index: null,
		alarmInfo: {}
	}
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state);
	switch (action.type) {
		case SET_ALARMS:
			newState.alarms = action.alarms;
			break;
		case SET_CURRENT_ALARM:
			newState.currentAlarm.alarmInfo = action.alarm;
			newState.currentAlarm.index = action.alarmIndex;
			break;
		case UNSET_CURRENT_ALARM:
			newState.currentAlarm = {index: null, alarmInfo: {}};
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
			// console.error('1', alarms);
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
	const updatedAlarms = currentAlarms.splice(alarmIndex, 1);
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
