import { View, Text, Image, TouchableOpacity, Pressable, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
//import {ChatRoom, ChatRoomUser, User} from "../../app/models"
import { Auth, DataStore } from 'aws-amplify';
export default function UserItem({user}) {

 const navigation =useNavigation();

/*const onPress=async()=>{

  const newChatRoom=await DataStore.save(new ChatRoom({
    newMessages:0
  }))
    const authUser=await Auth.currentAuthenticatedUser();

    const dbUser=await DataStore.query(User,authUser.attributes.sub);
    await DataStore.save(new ChatRoomUser({
     user:dbUser,
     chatRoom:newChatRoom
    }));


    await DataStore.save(new ChatRoomUser({
      user,
      chatRoom:newChatRoom
    }));

    navigation.navigate('/chatRoom',{id:newChatRoom.id})
}
*/

  return (
    <TouchableOpacity >
    <View style={{paddingTop:20}}>
    
    <View style={{ paddingHorizontal: 10, flexDirection: "row",alignItems:"center" ,gap:10}}>
    <Pressable style={{flexDirection:"row",paddingHorizontal:2}}>
    <Image source={{ uri: user.users.imageUrl }} style={{ height: 50, width: 50, borderRadius: 21, borderWidth: 2, borderColor: "#565656" }} />
    
   
   </Pressable>
    <View style={{ flex: 1 ,paddingHorizontal:6}}>
    
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{flexDirection:"row", gap:10}}>
    
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{user.users.name}</Text>
        
              </View>

      </View>
     
    </View>
  
    </View>
    
  </View>
  
  
    </TouchableOpacity>
  )
}