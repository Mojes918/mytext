import { View, Text, Image, TouchableOpacity, Pressable, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
export default function ChatListItem({chatRoom}) {

 const router=useRouter();




  return (
    <TouchableOpacity onPress={()=>router.push('/chatRoom')}>
    <View style={{paddingTop:20}}>
    
    <View style={{ paddingHorizontal: 10, flexDirection: "row",alignItems:"center" ,gap:10}}>
    <Pressable style={{flexDirection:"row",paddingHorizontal:2}}>
    <Image source={{ uri: chatRoom.users.imageUrl }} style={{ height: 50, width: 50, borderRadius: 21, borderWidth: 2, borderColor: "#565656" }} />
    
    {chatRoom.newMessages&&
    <View style={{height:20,width:20,backgroundColor:"#3777f0",alignItems:"center",justifyContent:"center",borderRadius:15,position:"absolute",left:40,top:-2,borderColor:"white",borderWidth:1}}>
    <Text style={{color:"white",fontSize:12}}>{chatRoom.newMessages}</Text>
    </View>}
   </Pressable>
    <View style={{ flex: 1 ,paddingHorizontal:6}}>
    
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{flexDirection:"row", gap:10}}>
    
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{chatRoom.users.name}</Text>
        {/*

          data.newMessages &&
              <View style={{height:20,width:20,backgroundColor:"#3777f0",alignItems:"center",borderRadius:10}}>
              <Text style={{color:"white",fontSize:13}}>{data.newMessages}</Text>
              </View>
      
             */}

              </View>
        <Text style={{fontSize:12,color:"gray"}}>{chatRoom.lastMessage.createdAt}</Text>
      </View>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:0}}>
      
        <Text numberOfLines={1} style={{fontSize:14,color:"gray"}}>{chatRoom.lastMessage.content}</Text>
       <Text style={{fontSize:12,color:"gray"}}>Seen</Text>
    </View>
  
    </View>
    
  </View>
  
    </View>
    </TouchableOpacity>
  )
}