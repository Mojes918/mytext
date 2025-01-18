import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, useColorScheme, Alert, Image, ImageBackground, Modal, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import Message from '@/components/Message/Message';
import MessageInput from '@/components/Message/MessageInput';
import { useRoute, RouteProp } from '@react-navigation/native';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getChatRoom, listMessages } from '@/src/graphql/queries';
import { ActivityIndicator } from 'react-native-paper';
import { onCreateMessage } from '../src/graphql/subscriptions';
import ChatRoomHeader from '@/components/ChatRoomHeader';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';
import * as mutations from "../src/graphql/mutations";
import Svg, { Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
type MessageType = {
  id: string;
  content: string;
  userID: string;
  createdAt: string;
  chatroomID: string;
  status: string;
  replyToMessageID:string;
};

interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
}

interface ChatRoomUser {
  id: string;
  chatRoomId: string;
  userId: string;
  user: User;
}

type ChatRoomType = {
  id: string;
  newMessages: number;
  messages: MessageType[];
};

type GetChatRoomResponse = {
  data: {
    getChatRoom: ChatRoomType | null;
  };
};

type ListMessagesResponse = {
  data: {
    listMessages: {
      items: MessageType[];
    };
  };
};

type ChatRoomScreenRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

const ChatRoomScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [user, setUser] = useState<User | null>(null);
  const route = useRoute<ChatRoomScreenRouteProp>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoomType | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [viewableMessageIds, setViewableMessageIds] = useState<string[]>([]);
  const [messageReply,setMessageReply]=useState<MessageType|null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [fetchUser, setFetchUser] = useState<string | null>(null);
  


  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    const visibleMessageIds = viewableItems.map((item) => item.item.id);
    setViewableMessageIds((prevIds) => Array.from(new Set([...prevIds, ...visibleMessageIds])));
  };

  useEffect(() => {
    if (viewableMessageIds.length > 0) {
      markMessagesAsRead(viewableMessageIds);
    }
  }, [viewableMessageIds]);
  


const markMessagesAsRead = async (messageIds: string[]) => {
  try {
    const authUser = await Auth.currentAuthenticatedUser();
    let updatedChatRoom = { ...chatRoom }; // Copy current chat room state

    // Mark each message as read
    for (const messageId of messageIds) {
      const message = messages.find((msg) => msg.id === messageId);
      if (message && message.userID !== authUser.attributes.sub && message.status !== 'READ') {
        await API.graphql({
          query: mutations.updateMessage,
          variables: {
            input: {
              id: messageId,
              status: 'READ',
            },
          },
        });
      }
    }

    // Update the chat room's newMessages count
    if (updatedChatRoom) {
      updatedChatRoom.newMessages = 0; // Reset newMessages to 0 after messages are viewed
      await API.graphql({
        query: mutations.updateChatRoom,
        variables: {
          input: {
            id: updatedChatRoom.id,
            newMessages: updatedChatRoom.newMessages,
          },
        },
      });
      setChatRoom(updatedChatRoom); // Update the local state with the new value
    }

  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

  

  useEffect(() => {
    fetchChatRoom();
  }, []);

  useEffect(() => {
    if (chatRoom) {
      fetchMessages();
    }
  }, [chatRoom]);

  useEffect(() => {
    if (!chatRoom?.id) return;

    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, { filter: { chatroomID: { eq: chatRoom.id } } })
    ).subscribe({
      next: ({ value }) => {
        const newMessage = value.data.onCreateMessage;
         // Update the last message ID in the chat room
      setChatRoom((prevChatRoom) => {
        if (prevChatRoom) {
          return {
            ...prevChatRoom,
            chatRoomLastMessageId: newMessage.id,
          };
        }
        return prevChatRoom;
      });
      
        setMessages((existingMessages) => {
          const updatedMessages = [newMessage, ...existingMessages].filter((msg, index, self) =>
            index === self.findIndex((m) => m.id === msg.id) // Ensures unique message IDs
          );
          updatedMessages.sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          return updatedMessages;
        });
      },
      error: (error) => console.error('Subscription error:', error),
    });

    return () => subscription.unsubscribe();
  }, [chatRoom?.id]);

  const fetchChatRoom = async () => {
    try {
      const chatRoomId = route.params?.id;
      if (!chatRoomId) {
        Alert.alert('Error', 'No ChatRoom ID provided.');
        return;
      }

      const chatRoomResponse = (await API.graphql({
        query: getChatRoom,
        variables: { id: chatRoomId },
      })) as GetChatRoomResponse;

      const fetchedChatRoom = chatRoomResponse?.data?.getChatRoom;
      if (!fetchedChatRoom) {
        Alert.alert('Error', 'ChatRoom not found.');
        return;
      }

      setChatRoom(fetchedChatRoom);
    } catch (error) {
      console.error('Error fetching chat room:', error);
      Alert.alert('Error', 'Failed to fetch the chat room.');
    }
  };

  const fetchMessages = async () => {
    let nextToken = null;
    let allMessages = [];

    try {
      do {
        const result = await API.graphql(
          graphqlOperation(listMessages, {
            filter: { chatroomID: { eq: chatRoom?.id } },
            limit: 50,
            nextToken,
          })
        );

        allMessages = [...allMessages, ...(result?.data?.listMessages?.items || [])];
        nextToken = result?.data?.listMessages?.nextToken;
      } while (nextToken);

      const sortedMessages = allMessages
  .filter((message) => (message.content || message.image || message.audio) && message.createdAt)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages with pagination:", error);
    }
  };

  useEffect(() => {
    const chatRoomId = route.params?.id;
    if (!chatRoomId) return;

    const fetchUsers = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        const chatRoomUsersResponse = await API.graphql({
          query: listChatRoomUsersWithDetails,
          variables: { filter: { chatRoomId: { eq: chatRoomId } } },
        });
   setAuthUserId(authUser.attributes.sub);
   
        const users: ChatRoomUser[] = chatRoomUsersResponse?.data?.listChatRoomUsers?.items || [];
        const fetchedUsers = users
          .map((chatRoomUser) => chatRoomUser.user)
          .filter((u) => u.id !== authUser.attributes.sub);
        setFetchUser(fetchedUsers[0]||null);
        setUser(fetchedUsers[0] || null);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [route.params?.id]);

  const renderItem = ({ item, index }) => {
    const messageDate = new Date(item.createdAt);
    const nextMessageDate = index < messages.length - 1 ? new Date(messages[index + 1].createdAt) : null;
    const showDateSeparator =
      !nextMessageDate || messageDate.toDateString() !== nextMessageDate.toDateString();

    return (
      <View style={{ marginBottom: 3 }}>
        {showDateSeparator && (
          <Text
            style={{
              textAlign: 'center',
              color: isDarkMode ? '#BBBBBB' : 'gray',
              marginVertical: 10,
            }}
          >
            {messageDate.toDateString()}
          </Text>
        )}
        
        <Message message={item} isFirst={index === 0} isSameUser={index > 0 && item.userID === messages[index + 1]?.userID} setAsMessageReply={()=>setMessageReply(item)} authUserId={authUserId} messageReply={messageReply} fetchUser={fetchUser}/>
      </View>
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ backgroundColor: isDarkMode ? '#121212' : 'white', flex: 1 }}>
      
      {loadingMessages && <ActivityIndicator size="large" />}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // Mark message as seen if 50% is visible
        }}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 20 }}
        ListFooterComponent={
          <View style={{ alignItems: 'center', margin: 80 }}>
            <Image
              source={{ uri: user?.imageUri || 'https://via.placeholder.com/30' }}
              style={{ height: 120, width: 120, borderRadius: 60 }}
            />
            <Text style={{ fontSize: 25, margin: 10, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
              {user?.name}
            </Text>
          </View>
        }
      />
      <MessageInput chatRoom={chatRoom} messageReply={messageReply} removeMessageReply={()=>setMessageReply(null)}   authUserId={authUserId} user={user}/>
     
    </View>
    
  );
};

export default ChatRoomScreen;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

