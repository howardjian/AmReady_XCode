import React, {Component} from 'react';
import MapView from 'react-native-maps';

export default function({start_lat,start_long,end_lat,end_long, polylines}){

    let centerPt = calcCenter(start_lat,start_long,end_lat,end_long);

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
        {
            polylines ?
                <MapView.Polyline
                    coordinates=
                    {[
                        {latitude: start_lat, longitude: start_long},
                        ...polylines,
                        {latitude: end_lat, longitude: end_long},
                        ]}
                    strokeWidth={4} />
                :
                null
        }
            <MapView.Marker
            coordinate={{ longitude: start_long,
                            latitude: start_lat
                        }}
            />
            <MapView.Marker
            coordinate={{ longitude: end_long,
                            latitude: end_lat
                        }}
            />
        </MapView>
    )
}

function calcCenter(start_lat,start_long,end_lat,end_long){
  let startLat = start_lat;
  let startLong = start_long;
  let endLat = end_lat;
  let endLong = end_long;
  let latDelta = !Math.ceil(Math.abs(startLat - endLat)) ? 0.0922 : Math.abs(startLat - endLat)

  let longDelta = !Math.ceil(Math.abs(startLong - endLong)) ? 0.0421 :
  Math.abs(startLong - endLong)

  let centerPt = {
    latitudeDelta: latDelta,
    longitudeDelta: longDelta,
    latitude: (startLat + endLat)/2,
    longitude: (startLong + endLong)/2
  }

  return centerPt;
}
