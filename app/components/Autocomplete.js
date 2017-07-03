import PlacesAutoComplete from 'react-native-places-autocomplete';
import React, {Component} from 'react';
import {SearchBar, Divider, Button} from 'react-native-elements';
import { StyleSheet, Text, View, TextInput } from 'react-native';



export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchText:'',
            userLocation:''
        }
     
    }

    componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            (location)=>{this.setState({userLocation:location})
        })
    }//this.state.userLocation.longitude
    textChange(string){
        let baseUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";
        let url = `input=${string}&types=establishment&location=
                        ${this.state.userLocation.coords.latitude},
                        ${this.state.userLocation.coords.longitude}
                        &key=${"AIzaSyDfu6FrpQXz4TaxbnOzWVb69YFVSBNPFo0"}`;

        let request = baseUrl+url;
        fetch(request,{ mode: 'no-cors' })
        .then(data => {
            return data.json();
        })
        .then(object => {
            console.log(object)
        })
    }
    //AIzaSyDfu6FrpQXz4TaxbnOzWVb69YFVSBNPFo0
    render(){
        return (
            <SearchBar
            ref='searchBar'
            placeholder='Search'
            onChangeText={text => {
                this.textChange(text);
                }}
                onSearchButtonPress={()=> {}}
                
                onCancelButtonPress={()=> {}}
                />
        )
    }
}

 