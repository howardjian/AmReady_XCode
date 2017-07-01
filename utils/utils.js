export const stateifyDbData = (data) => {
  let route = data.route;
  let newState = Object.assign({}, {
    alarmName: data.alarmName,
    arrivalTime: data.arrivalTime,
    prepTime: data.prepTime.toString(),
    start: route.address.start,
    end: route.address.end,
    start_lat: route.start_lat,
    start_long: route.start_long,
    end_lat: route.end_lat,
    end_long: route.end_long,
    timerId: data.timerId
  })
  return newState;
}


export const decode = (encoded) => {
  var points=[ ]
  var index = 0, len = encoded.length;
  var lat = 0, lng = 0;
  while (index < len) {
    var b, shift = 0, result = 0;

    do {
      //finds ascii and substract it by 63
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
      } while (b >= 0x20);

    var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({latitude:( lat / 1E5),longitude:( lng / 1E5)})

  }
  return points
}

export const AsyncStorageFormat = () => {
  const currentAlarm = this.state;

  return {
    timerId: currentAlarm.timerId,
    alarmName: currentAlarm.alarmName,
    isRecurring: 1,
    daysOfWeek: [currentAlarm.daysOfWeek],
    route: {
       start_lat: currentAlarm.start_lat,
       start_long: currentAlarm.start_long,
       end_lat: currentAlarm.end_lat,
       end_long: currentAlarm.end_long,
       modeOfTransport: 'Train',
       preferredRoute: 'need_to_figure_out',
       address: {
         start: currentAlarm.start,
         end: currentAlarm.end
       },
       routeSelectedBool: currentAlarm.routeSelectedBool
    },
    prepTime: currentAlarm.prepTime,
    arrivalTime: currentAlarm.arrivalTime,
    contacts: [
       {
          user: 56,
          type: 'email'
       }
    ]
  }
}
