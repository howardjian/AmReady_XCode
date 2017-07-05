import React, {Component} from 'react';
import {SearchBar, Button} from 'react-native-elements';
import { View } from 'react-native';



export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            userLocation:'',
            possibleLocations:[],
            currentValue:''
        }
     this.selectEvent = this.selectEvent.bind(this);
    }

    componentWillMount(){

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
        let baseUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";
        let url = `input=${string}&types=address&
                        &key=${"AIzaSyBq0-IRUlG9ORXcMvAxEMXSdxOsEv25OD8"}`;

        let request = baseUrl+url;
        fetch(request,{ mode: 'no-cors' })
        .then(data => {
            return data.json();
        })
        .then(locations => {

            this.setState({currentTerm:string,possibleLocations:locations.predictions})
        })
    }

    selectEvent(places){
         this.props.locationChangeHandler(places.description);
         this.setState({
             currentTerm:places.structured_formatting.main_text,
             possibleLocations:null,
             currentValue:places.description
            })
    }
    render(){
        return (
            <View>
                <SearchBar
                    containerStyle={{ backgroundColor: '#333333', width: 340, alignSelf: 'center', borderTopWidth: 0, borderBottomWidth: 0}}
                    inputStyle={{backgroundColor: '#333333', color: 'white' }}
                    placeholder={this.props.placeHolder}
                    ref='searchBar'
                    value={this.state.currentTerm}
                    onChangeText={text => {this.textChange(text)}}
                    />
                    {
                        this.state.possibleLocations ?
                        this.state.possibleLocations.map(places => {
                            return (
                                <Button small key=                                            {places.id}
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

