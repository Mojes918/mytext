import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const MessageInput = () => {
    const [message,setMessage]=useState('');


  const sendMessage=()=>{
    Alert.alert('sending a message',message);
    setMessage('');
  }

  const onPlusClicked=()=>{
    Alert.alert("ONplusclick");
  }

  const onPress=()=>{
    if(message){
      sendMessage();
    }else{
      onPlusClicked();
    }
  }


  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
      <Entypo name="emoji-happy" size={24} color="black" style={styles.icon}/>
      <TextInput
      style={styles.input}
      placeholder='Type a message...'
    value={message}
    onChangeText={setMessage}
      />
      <MaterialCommunityIcons name="microphone-outline" size={24} color="black" />
      <Feather name="camera" size={22} color="black" style={styles.icon}/>
      </View>
      <Pressable  onPress={onPress} style={styles.buttonContainer}>
     {
        message?<Ionicons name="send-outline" size={25} color="white" />:<Feather name="plus" size={24} color="white" />
     }
      </Pressable>
    </View>
  )
}

export default MessageInput

const styles=StyleSheet.create({
    root:{
        flexDirection:"row",
        padding:5
    },
    input:{
flex:1,
marginHorizontal:0
    },
    inputContainer:{
        backgroundColor:"lightgray",
        flex:1,
        marginRight:10,
        borderRadius:25,
        alignItems:"center",
        flexDirection:"row",
        padding:0
        
    },
    icon:{
marginHorizontal:10,
    },
    buttonContainer:{
width:50,
height:50,
backgroundColor:"#3777f0",
justifyContent:"center",
alignItems:"center",
borderRadius:25
    },
    buutontext:{
        color:"white",
        fontSize:35
    }
})