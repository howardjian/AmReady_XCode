import React from 'react';
import {Text, View, Image } from 'react-native';
import { Button } from 'native-base';

export default function({transit,icon, index, selectRoute, duration}) {

  const d = Math.floor(duration / 60);

  return (
    <View style={{paddingLeft: 15}}>


      <Button bordered light>
         <Text style={{color: 'white', fontSize: 18, paddingLeft: 15}}> <Image
        style={{width: 20, height: 20}}
         source = {{uri: `https:${icon}`}}
      /> Duration: <Text style={{color: '#00BFFF', fontSize: 18, paddingLeft: 15}}> {' ' + d +' minutes'} </Text></Text>

      </Button>





    </View>
  )
}
