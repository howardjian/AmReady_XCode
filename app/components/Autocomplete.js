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
     
    }

    componentDidMount(){  
        navigator.geolocation.getCurrentPosition(
            (location)=>{this.setState({userLocation:location})
        })
    }
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
        .then(locations => {
            this.setState({currentTerm:string,possibleLocations:locations.predictions})
        })
    }

    render(){
        return (
            <View>
                <SearchBar 
                    placeHolder={this.props.placeHolder}
                    ref='searchBar'
                    value={this.state.currentTerm}   
                    onChangeText={text => {this.textChange(text)}}
                    />
                    {
                        this.state.possibleLocations ? 
                        this.state.possibleLocations.map(places => {
                            return (
                                <Button small key={places.id}
                                title={places.description}
                                onPress={()=>{this.setState({
                                    currentTerm:places.structured_formatting.main_text, 
                                    possibleLocations:null,
                                    currentValue:places.description
                                    })}}
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

 