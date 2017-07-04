import React from 'react';
import {Text, View, Image } from 'react-native';
import { Button } from 'native-base';
import { Divider} from 'react-native-elements';

export default ({icon, duration}) => {

 const d = Math.ceil(duration / 60);

 return (
   <View >


     <Button  style={{width: 340, alignSelf: 'center', backgroundColor: '#878787', borderRadius: 3}}>
       <Text style={{color: '#00BFFF', fontSize: 18, paddingLeft: 15}}> <Image
       style={{width: 20, height: 20}}
        source = {{uri: `https:${icon}`}}
     /> Duration: <Text style={{color: 'white', fontSize: 18, paddingLeft: 15}}> {' ' + d +' minutes'} </Text></Text>

     </Button>


     <Divider style={{paddingTop: 8, backgroundColor: '#333333'}} />


   </View>
 )
}
