import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


;

const blue='#3777f0';
const gray='gray';

export default function Message({message}) {


  const isMe=message.user.id=="u1";
//const isMe=false;

  return (
    <View style={[styles.container, isMe?styles.rightContainer:styles.leftContainer]}>
    
    <Text style={{color:isMe?"black":"white"}}>{message.content}</Text>
    
   
    </View>
  )
}


const styles=StyleSheet.create({
  container:{
    padding:10,
    margin:10,
    borderRadius:10,
    maxWidth:"75%"
    
  },
  leftContainer:{
    backgroundColor:"#3777f0",
    marginLeft:10,
    marginRight:'auto',
    
  },
  rightContainer:{
    backgroundColor:gray,
    marginLeft:'auto',
    marginRight:10
  }

})