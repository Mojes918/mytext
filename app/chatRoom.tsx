import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import Message from '@/components/Message/Message'
import MessageInput from '@/components/Message/MessageInput'
import ChatRoomData from '@/assets/Data/Chats'
import { Feather, MaterialIcons } from '@expo/vector-icons'


const ChatRoomScreen = () => {
  return (
    <View style={{backgroundColor:"white",flex:1}}>
      <FlatList
      data={ChatRoomData.messages}
      inverted
      renderItem={({item})=><Message message={item}/>}/>
      <MessageInput/>
    </View>
  )
}

export default ChatRoomScreen