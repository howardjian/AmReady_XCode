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
    timerId: data.timerId,
    duration: route.duration
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

export const AsyncStorageFormat = (currentAlarm) => {
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
       routeSelectedHash: currentAlarm.routeSelectedHash,
       routeSelectedBool: currentAlarm.routeSelectedBool,
       duration: currentAlarm.duration
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

export const getArrivalTimeString = (time) => {
    const arrivalTime = new Date(time);
    const minutes = arrivalTime.getMinutes() < 10 ? `0${arrivalTime.getMinutes()}` : arrivalTime.getMinutes();
    let hours = arrivalTime.getHours();
    let label = 'AM';
    if (hours >= 12) {
      if(hours > 12){
        hours = hours - 12;
      }
      label = 'PM';
    } else if(!hours) {
      hours = 12;
    }

    return `${hours}:${minutes} ${label}`;
}

export const getDuration = (currentAlarm) => {
  let googleDirectionsQuery = "https://maps.googleapis.com/maps/api/directions/json?";
  googleDirectionsQuery+= `origin=${currentAlarm.route.address.start}&`
  googleDirectionsQuery+= `destination=${currentAlarm.route.address.end}&`;
  googleDirectionsQuery+= "mode=transit&alternatives=true&sensor=true&key=AIzaSyBq0-IRUlG9ORXcMvAxEMXSdxOsEv25OD8";

  return fetch(
    googleDirectionsQuery,
    { mode: 'no-cors' }
  )
  .then(
      (responseText) => {
        let routes = JSON.parse(responseText['_bodyInit'])["routes"];
        let allRoutes = [];
        routes.forEach(route => {
          allRoutes.push(route);
        })
        let foundRoute = allRoutes.filter(route => {
          return route["overview_polyline"]["points"] === currentAlarm.route.routeSelectedHash;
        })
        //testing purposes!!!
        // console.error(foundRoute[0]["overview_polyline"], "----------------", currentAlarm.route.routeSelectedHash);
        let duration = foundRoute[0].legs[0].duration.value;
        return duration
      }
  )
  .catch(
      (error) => {
          console.warn('Error', error);
      }
  );
}
