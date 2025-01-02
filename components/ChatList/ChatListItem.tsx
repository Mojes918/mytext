import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API, Auth } from 'aws-amplify';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery'; // Import the GraphQL query
import { getMessage } from '@/src/graphql/queries';

// Interfaces for TypeScript
interface Message {
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
}

interface ChatRoom {
  id: string;
  newMessages: number;
  lastMessage: Message | null;
  chatRoomLastMessageId?: string; // Add chatRoomLastMessageId for fetching last message
}

interface ChatRoomUser {
  id: string;
  chatRoomId: string;
  userId: string;
  user: User;
}

export default function ChatListItem({ chatRoom }: { chatRoom: ChatRoom }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
const lastText=isDarkMode?"#A9A9A9":"#666";
  const textColor = isDarkMode ? 'white' : 'black';
  const bgColor = isDarkMode ? '#121212' : '#ffffff';
  const borderColor = isDarkMode ? '#565656' : '#666';

  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        const chatRoomUsersResponse = await API.graphql({
          query: listChatRoomUsersWithDetails,
          variables: {
            filter: { chatRoomId: { eq: chatRoom.id } },
          },
        });

        const users: ChatRoomUser[] = chatRoomUsersResponse?.data?.listChatRoomUsers?.items || [];
        const fetchedUsers = users.map((chatRoomUser) => chatRoomUser.user).filter((u) => u.id !== authUser.attributes.sub);

        setUser(fetchedUsers[0] || null);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch chat room users.');
      }
    };

    fetchUsers();
  }, [chatRoom.id]);

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!chatRoom.chatRoomLastMessageId) return console.log("No chat room last message ID");
  
      try {
        const response = await API.graphql({
          query: getMessage,
          variables: {
            id: chatRoom.chatRoomLastMessageId,
          },
        });
  
        const fetchedMessage = response?.data?.getMessage;
        setLastMessage(fetchedMessage || null);
      } catch (error) {
        console.error('Error fetching last message:', error);
        Alert.alert('Error', 'Failed to fetch the last message.');
      }
    };
  
    fetchLastMessage();
  }, [chatRoom.chatRoomLastMessageId]);

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: 'center', color: textColor }}>No Chats Available</Text>
      </View>
    );
  }

  const formatTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
  
    // Check if the message is from today
    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      let hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${hours}:${formattedMinutes} ${ampm}`;
    }
  
    // Check if the message is from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
  
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    }
  
    // Otherwise, return the formatted date
    const month = (messageDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = messageDate.getDate().toString().padStart(2, '0');
    const year = messageDate.getFullYear();
    return `${month}/${day}/${year}`;
  };
  

  return (
    <TouchableOpacity onPress={() => router.push(`/ChatRoomScreen?id=${chatRoom.id}`)}>
      <View style={{ paddingTop: 20, backgroundColor: bgColor }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5,gap:10 }}>
          <Pressable>
            <Image
              source={
                user.imageUri
                  ? { uri: user.imageUri }
                  : require('../../assets/images/default-user.png')
              }
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                borderWidth: 2,
                borderColor,
              }}
            />
            {chatRoom.newMessages > 0 && (
              <View
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: '#3777f0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  position: 'absolute',
                  left: 40,
                  top: -2,
                  borderColor: 'white',
                  borderWidth: 1,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>{chatRoom.newMessages}</Text>
              </View>
            )}
          </Pressable>

          <View style={{ flex: 1, paddingHorizontal: 5,gap:5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'medium', fontSize: 18, color: textColor }}>{user.name}</Text>
              {lastMessage?.createdAt && (
                <Text style={{ color: isDarkMode ? '#f2f2f2' : '#777777', fontSize: 12 }}>
                   {lastMessage?.createdAt && formatTime(lastMessage.createdAt)}
                </Text>
              )}
            </View>
            <Text style={{ fontSize: 14, color:lastText }} numberOfLines={1}>
              {lastMessage?.content || 'Say hi 👋'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
