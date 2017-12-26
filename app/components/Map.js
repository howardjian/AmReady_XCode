import React, {Component} from 'react';
import MapView from 'react-native-maps';

export default function({start_lat,start_long,end_lat,end_long, polylines}){
  const centerPt = calcCenter(start_lat,start_long,end_lat,end_long);

  return (
    <MapView
      style={{
          height: 200,
          width: 340,
          alignSelf:'center'
      }}
      region={{
          latitude: centerPt.latitude,
          longitude: centerPt.longitude,
          latitudeDelta: centerPt.latitudeDelta,
          longitudeDelta: centerPt.longitudeDelta,
      }}
    >
    { polylines ?
      <MapView.Polyline
        coordinates=
        {[  {latitude: start_lat, longitude: start_long},
            ...polylines,
            {latitude: end_lat, longitude: end_long}
        ]}
        strokeWidth={4} />
      :
      null
    }
    <MapView.Marker coordinate={{ longitude: start_long, latitude:start_lat}}/>
    <MapView.Marker coordinate={{ longitude: end_long, latitude: end_lat}}/>
    </MapView>
  )
}

const calcCenter = (start_lat, start_long, end_lat, end_long) => {
  const startLat = start_lat;
  const startLong = start_long;
  const endLat = end_lat;
  const endLong = end_long;
  const latDelta = !Math.ceil(Math.abs(startLat - endLat)) ? 0.0922 : Math.abs(startLat - endLat)

  const longDelta = !Math.ceil(Math.abs(startLong - endLong)) ? 0.0421 :
  Math.abs(startLong - endLong)

  const centerPt = {
    latitudeDelta: latDelta,
    longitudeDelta: longDelta,
    latitude: (startLat + endLat)/2,
    longitude: (startLong + endLong)/2
  }

  return centerPt;
}
