import React, {Component} from 'react';
import {SearchBar, Button} from 'react-native-elements';
import { View } from 'react-native';
// import _ from 'lodash';

export default class extends Component {
  constructor(props){
    super(props);
    this.state = {
        userLocation:'',
        possibleLocations:[],
        currentValue:''
    }
    this.selectEvent = this.selectEvent.bind(this);
    this.textChange = this.textChange.bind(this);
  }

  componentWillMount() {
    this.props.savedState ?
      this.setState({currentTerm: this.props.savedState})
    :
    navigator.geolocation.getCurrentPosition(
      (location)=>{
      if(this.props.start){
          this.props.getUserCurrentPosition(location.coords.latitude, location.coords.longitude);
          this.setState({currentTerm:"Current Location"});
      }
      this.setState({userLocation:location})
    })
  }

  textChange(string){
    const key = "AIzaSyANJ3PJ8YIklC2CFaxN300ZcXJ6IwACDag";
    let baseUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${string}`;

    const address = `&types=address&location=&key=${key}`;
    const establishment = `&types=establishment&location=&key=${key}`;
    const region = `&types=regions&location=&key=${key}`;

    const addressRequest = baseUrl+address;
    const establishmentRequest = baseUrl+establishment;
    const regionRequest = baseUrl+region;
    Promise.all([
        fetch(addressRequest,{ mode: 'no-cors' }),
        fetch(establishmentRequest,{ mode: 'no-cors' }),
        fetch(regionRequest,{ mode: 'no-cors' })
        ])
    .then(locations => {
        const addressPredictions = JSON.parse(locations[0]["_bodyInit"]).predictions;
        const establishmentPredictions = JSON.parse(locations[1]["_bodyInit"]).predictions;
        const regionPredictions = JSON.parse(locations[2]["_bodyInit"]).predictions;
        if(addressPredictions.length >= establishmentPredictions.length && addressPredictions.length >= regionPredictions.length){
          this.setState({currentTerm:string,possibleLocations:addressPredictions});
        }
        else if(establishmentPredictions.length >= addressPredictions.length && establishmentPredictions.length >= regionPredictions.length){
          this.setState({currentTerm:string,possibleLocations:establishmentPredictions});
        }
        else{
          this.setState({currentTerm:string,possibleLocations:regionPredictions});
        }
    })
    .catch(err => {
        console.warn("ERROR", err);
    });
  }

  selectEvent(places){
    this.props.locationChangeHandler(places.description);
    this.setState({
      currentTerm:places.structured_formatting.main_text,
      possibleLocations:null,
      currentValue:places.description
    });
  }

  render() {
    return (
      <View>
        <SearchBar
          containerStyle={{ backgroundColor: '#333333', width: 340, alignSelf: 'center', borderTopWidth: 0, borderBottomWidth: 0}}
          inputStyle={{backgroundColor: '#333333', color: 'white' }}
          placeholder={this.props.placeHolder}
          ref='searchBar'
          value={this.state.currentTerm}
          onChangeText={text => {this.textChange(text)}}
          returnKeyType={ "done" }
        />
        { this.state.possibleLocations ?
          this.state.possibleLocations.map(places => {
            return (
              <Button
                small
                key={places.id}
                title={places.description}
                onPress={()=>{this.selectEvent(places)}}
              />
            )
          })
          :
          null
        }
      </View>
    )
  }
}
