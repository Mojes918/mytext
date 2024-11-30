import { Button, FlatList, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import ChatListItem from "../../components/ChatList/ChatListItem"
import ChatData from '@/assets/Data/ChatData';
import { Feather, MaterialIcons } from '@expo/vector-icons';


import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';




 function HomeScreen() {

 // const [chatRooms,setChatRooms]=useState<ChatRoom>([])

const router=useRouter();

/*useEffect(()=>{
const fetchChatRooms= async ()=>{
  const ChatRooms=await DataStore.query(ChatRoom);
  console.log(chatRooms);
  //setChatRooms(chatRooms);
};
fetchChatRooms();
},[]);*/


/*const LogOut=()=>{
Auth.signOut();
}*/


const users=()=>{
  router.push("/UsersScreen");
}

  return (
    <View style={{backgroundColor:"white",flex:1}}>
       <View style={{ width: "100%", height: 50, backgroundColor: "", paddingHorizontal: 15, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 28 ,fontFamily:"Robo",color:"#3777f0"}}>MyText</Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity onPress={users}>
            <MaterialIcons name="add-circle-outline" size={20} color="#3777f0" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="menu" size={20} color="#3777f0" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={ChatData}
        renderItem={({ item }) => <ChatListItem chatRoom={item} />}
        ListHeaderComponent={() => <Text style={{paddingHorizontal:15}}>Messages</Text>}
      />
      {/*<Button title='LogOut'/>*/}
    </View>

  )
}

export default HomeScreen;