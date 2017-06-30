import React, {Component} from 'react';
import { StyleSheet, Text, View , Button,TextInput } from 'react-native';
import MapView from 'react-native-maps';


export default function({start_lat,start_long,end_lat,end_long, polylines}){
    return (
        <MapView
            style={{
                height: 400,
                width: 400}}
            initialRegion={{
                latitude: start_lat,
                longitude: start_long,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
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
