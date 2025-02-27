import { View, Text, Image, TouchableOpacity, Pressable, useColorScheme, Alert } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { API, Auth } from 'aws-amplify';
import * as mutations from '../../src/graphql/mutations';
import { chatRoomUsersByChatRoomId, chatRoomUsersByUserId, getUser, listChatRooms } from '@/src/graphql/queries';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  ChatRoomScreen: { id: string };
};

export default function UserItem({ user }: { user: { id: string; name: string; imageUri?: string } }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
const router=useRouter();
  const textColor = isDarkMode ? 'white' : 'black';
  const backgroundColor = isDarkMode ? '#121212' : 'white';
  const borderColor = isDarkMode ? '#333' : '#ddd';


//console.log(user);
  const onPress = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const authUserId = authUser.attributes.sub;
  
      // Step 1: Fetch all chat rooms for the current authenticated user
      const userChatRoomUsersResponse: any = await API.graphql({
        query: chatRoomUsersByUserId,
        variables: {
          userId: authUserId,
          limit: 100, // Adjust limit if you expect a large number of chat rooms
        },
      });
  
      const userChatRoomUsers = userChatRoomUsersResponse.data.chatRoomUsersByUserId.items || [];
  
      // Step 2: Check if any of the user's chat rooms include the selected user
      let existingChatRoomId: string | null = null;
      //console.log("User pressed:", user);
      for (const chatRoomUser of userChatRoomUsers) {
        const chatRoomId = chatRoomUser.chatRoomId;
  
        // Fetch all users in the current chat room
        const chatRoomUsersResponse: any = await API.graphql({
          query: chatRoomUsersByChatRoomId,
          variables: {
            chatRoomId,
            limit: 100, // Adjust limit if necessary
          },
        });
  
        const chatRoomUsers = chatRoomUsersResponse.data.chatRoomUsersByChatRoomId.items || [];
        const includesSelectedUser = chatRoomUsers.some(
          (chatUser: any) => chatUser.userId === user.id
        );
  
        if (includesSelectedUser) {
          existingChatRoomId = chatRoomId;
          break;
        }
      }
  
      if (existingChatRoomId) {
        //console.log("Navigating to existing chat room:", existingChatRoomId);
        router.push({ pathname: '/ChatRoomScreen', params: { ChatRoomId: existingChatRoomId } });

        return;
      }
  
      // Step 3: Create a new chat room if no existing one is found
      const newChatRoomResponse = await API.graphql({
        query: mutations.createChatRoom,
        variables: { input: {  } },
      });
  
      const newChatRoomId = newChatRoomResponse.data.createChatRoom.id;
  
      // Add both users to the new chat room
      await Promise.all([
        API.graphql({
          query: mutations.createChatRoomUser,
          variables: { input: { userId: authUserId, chatRoomId: newChatRoomId } },
        }),
        API.graphql({
          query: mutations.createChatRoomUser,
          variables: { input: { userId: user.id, chatRoomId: newChatRoomId } },
        }),
      ]);
      //console.log("Creating new chat room...");
      //console.log("Navigating to new chat room:", newChatRoomId);
      router.push({ pathname: '/ChatRoomScreen', params: { ChatRoomId: newChatRoomId } });
    } catch (error: any) {
      //console.error('Error creating or navigating to chat room:');
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };
  



return(
    <TouchableOpacity style={{padding:5}}>
      <TouchableOpacity style={{ padding: 10,alignItems:"center" }}  onPress={onPress}>
        <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable style={{ flexDirection: 'row', paddingHorizontal: 2 }}>
            <Image
              source={{ uri: user.imageUri || '../../assets/images/default.jpg' }}
              style={{
                height: 45,
                width: 45,
                borderRadius: 25,
                borderWidth: 2,
                borderColor,
              }}
            />
          </Pressable>
          <View style={{ flex: 1, paddingHorizontal: 6 }}>
            <Text style={{ fontWeight: 'medium', fontSize: 18, color: textColor }}>{user.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

