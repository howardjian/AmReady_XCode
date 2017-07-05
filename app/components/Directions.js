import React, {Component} from 'react';
import {SearchBar, Divider, Button} from 'react-native-elements';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import RouteOptions from './RouteOptions';
import Map from './Map';
import { decode } from '../../utils/utils';
import Autocomplete from './Autocomplete';

export default class extends Component {
    constructor(props){
        super(props);

        const defaultState = {
            start: null,
            end: null,
            start_lat: 37.78825,
            start_long: -122.4324,
            end_lat: 37.78825 ,
            end_long: -122.4324,
            directions: false,
            trainOptions: [],
            routeSelectedBool: false,
            routeSelectedHash: '',
            routeIndex: null,
            duration: '',
            responseObjRoutes: {}
        }

        if(props.alarmInfo.alarmName) {
            this.state = Object.assign({}, defaultState, {...props.alarmInfo});
        } else {
            this.state = defaultState;
        }
        this.getDirections = this.getDirections.bind(this);
        this.selectRoute = this.selectRoute.bind(this);
        this.updateNewState = this.updateNewState.bind(this);
        this.getTheStartAddress = this.getTheStartAddress.bind(this);
        this.getTheEndAddress = this.getTheEndAddress.bind(this);
    }

    createStartAndEndLatLong(directionsObj){
      return {
        start_lat: directionsObj["routes"][0]["legs"][0]["start_location"].lat,
        start_long: directionsObj["routes"][0]["legs"][0]["start_location"].lng,
        end_lat: directionsObj["routes"][0]["legs"][0]["end_location"].lat,
        end_long: directionsObj["routes"][0]["legs"][0]["end_location"].lng
      }
    }

    getDirections(){
      if(this.state.start && this.state.end){
        let googleDirectionsQuery = "https://maps.googleapis.com/maps/api/directions/json?";
        googleDirectionsQuery+= `origin=${this.state.start}&`;
        googleDirectionsQuery+= `destination=${this.state.end}&`;
        googleDirectionsQuery+= "mode=transit&alternatives=true&sensor=true&key=AIzaSyDeLijmYBeZMZA2UN2vAB_AYj9PHya8JjY";

        fetch(
          googleDirectionsQuery,
          { mode: 'no-cors' }
        )
        .then(
            (responseText) => {
              let routes = JSON.parse(responseText['_bodyInit'])["routes"];

              this.setState({responseObjRoutes: routes})
              let tmpOptions = [];
              for(let j = 0; j < routes.length; j++) {
                let duration = routes[j].legs[0].duration
                let currentRoute = routes[j].legs[0].steps
                let polylines = decode(routes[j]["overview_polyline"]["points"])
                for(let i = 0; i < currentRoute.length; i++) {
                  if(currentRoute[i]["travel_mode"] === "TRANSIT"){
                    let tmpObj = currentRoute[i]["transit_details"].line;
                    tmpObj.polylines = polylines;
                    tmpObj.duration = duration.value;
                    tmpOptions.push(tmpObj);
                  }
                }
              }
              let latLongObject = this.createStartAndEndLatLong(JSON.parse(responseText['_bodyInit']));

              let start_lat = latLongObject.start_lat;
              let end_lat = latLongObject.end_lat;
              let start_long = latLongObject.start_long;
              let end_long = latLongObject.end_long;
              tmpOptions = tmpOptions.filter(option => option != undefined)

              this.setState(
                {
                  start_lat,
                  start_long,
                  end_lat,
                  end_long,
                  trainOptions:tmpOptions,
                  directions: true
                }
              )
            }
        )
        .then(this.updateNewState)
        .catch(
            (error) => {
                console.warn('Error', error);
            }
        );
      }
    }

    updateNewState() {
      this.props.updateNewState({
        start: this.state.start,
        end: this.state.end,
        start_lat: this.state.start_lat,
        start_long: this.state.start_long,
        end_lat: this.state.end_lat ,
        end_long: this.state.end_long,
        directions: this.state.directions,
        trainOptions: this.state.trainOptions,
        routeIndex: this.state.routeIndex,
        routeSelectedHash: this.state.trainOptions[this.state.routeIndex],
        routeSelectedBool: this.state.routeSelectedBool
      })
    }

    selectRoute(index, duration){
      this.props.updateNewState({
        routeIndex: index,
        routeSelectedHash: this.state.responseObjRoutes[+index]["overview_polyline"]["points"],
        duration
      })
      this.setState({
        routeSelectedBool: true,
        routeIndex: index,
        duration
      })
    }

    getTheStartAddress(start){
        this.setState({start})
    }

    getTheEndAddress(end){
      this.setState({end})
    }

    render(){
        return (
          <View>
            {
              <View>
                <Autocomplete locationChangeHandler={this.getTheStartAddress} placeHolder='From...' />

                <Divider style={{width: 340, alignSelf:'center', backgroundColor: '#696969'}}/>
                <Divider style={{paddingTop: 8, backgroundColor: '#333333'}}/>

                <Autocomplete locationChangeHandler={this.getTheEndAddress} placeHolder='To...' />

                <Divider style={{width: 340, alignSelf:'center', backgroundColor: '#696969'}}/>
                <Divider style={{paddingTop: 8, backgroundColor: '#333333'}}/>

               <Button
                backgroundColor={ '#00BFFF' }
                small
                icon={{name: 'subway'}}
                onPress={this.getDirections}
                title="Get Directions"
               />
               <Divider style={{paddingTop: 5, backgroundColor: '#333333'}} />
              </View>
            }{
              this.state.directions && (
              <View>
                {
                  this.state.routeSelectedBool ?
                    <Map start_lat={this.state.start_lat}
                      start_long={this.state.start_long}
                      end_lat={this.state.end_lat}
                      end_long={this.state.end_long}
                      polylines={this.state.trainOptions[this.state.routeIndex]["polylines"]}
                      />
                  :
                  <Map start_lat={this.state.start_lat}
                    start_long={this.state.start_long}
                    end_lat={this.state.end_lat}
                    end_long={this.state.end_long}
                    />
                }
                  <Divider style={{paddingTop: 8, backgroundColor: '#333333'}}/>
                  <View>
                    {
                      this.state.trainOptions.length
                      ?
                      this.state.trainOptions.map((option,index) => (
                        <RouteOptions
                          key={index}
                          transit={option.short_name}
                          icon={option.icon} index={index} selectRoute={this.selectRoute}
                          duration ={option.duration}
                        />
                      ))
                      :
                      <Text>NO Routes Available</Text>
                    }

                  </View>

              </View>)
              }
          </View>
        )
    }
}

// # Guide on Google Maps API
//
// WARNING: First and foremost, there are two services: Google Maps Directions API library which contains an actual Google Maps Instance object... this is NOT what we're currently using. Instead, we are querying to google directly via the following format:
//
// http://maps.googleapis.com/maps/api/directions/outputFormat?parameters
//
// The parameters can be found here under "required parameters" and "optional parameters": https://developers.google.com/maps/documentation/directions/intro#RequestParameters
//
// First thing is in the render function of our class, we have a ternary for the user's input of start and end location that is hooked up to the state, if these are valid addresses, they will render the google maps view.
//
// Upon submit of the valid addresses, the get directions is called, which runs the google maps api fetch request
//
// THE IMPORTANT THING ABOUT THE CRAZY NESTED RESPONSE OBJECT is that not every part of the object is "JSON-ified" and that this object is nested in different ways depending on the query / type of response (eg. if one part of the route is walking, this route object will look different than the part of the route that is a transit object)
//
// Here are some examples:
// - JSON.parse(responseText['_bodyInit']) <- THE '_bodyInit' is text
// - IF(routes[j].legs[0].steps[i]["travel_mode"] === "TRANSIT")
//    - To break this down:
//      - Every request can have multiple routes, which is set by the query
//        param (&alternatives=true), otherwise it will return the best route
//        at the time of the request
//      - Each route will have legs[0] (not sure why yet but there has always //        been 1 leg)
//      - Each route / leg will have "steps", which occur every time the
//        transit type changes during the route. For example, if my route was:
//          1. Walk to train station
//          2. Take E train down to world trade center
//          3. Walk from world trade center to Fullstack
//
//        Then there would 3 "steps" and within each of these steps will be
//        another "steps" object for each direction that you are walking
//
// We take the lat + long coordinates from the start and end point, set them to the state, as well as push all the transit routes to an array, which we will set to state (trainOptions).
// We conditionally map over our trainOptions array and render our dumb component that we've imported from RouteOptions.js for each of the train options
