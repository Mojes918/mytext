import { FlatList } from 'react-native';
import { Text, View } from 'react-native';



import UserItem from "../components/UserItem/UserItem"

import { useState ,useEffect} from 'react';
import React from 'react';
import Chats from '@/assets/Data/Chats';
import ChatData from '@/assets/Data/ChatData';


 function UsersScreen() {


//const [users,setUsers]=useState<User[]>([]);
//useEffect(()=>{
 // DataStore.query(User).then(setUsers);
//},[])



  return (
    <View style={{backgroundColor:"white",flex:1}}>
      <FlatList
        data={ChatData}
        renderItem={({ item }) => <UserItem user={item} />}
        ListHeaderComponent={() => <Text style={{paddingHorizontal:15}}>users</Text>}
      />
      
    </View>

  )
}

export default UsersScreen;