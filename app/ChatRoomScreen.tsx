import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, useColorScheme, Alert, Image } from 'react-native';
import Message from '@/components/Message/Message';
import MessageInput from '@/components/Message/MessageInput';
import { useRoute, RouteProp } from '@react-navigation/native';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getChatRoom, listMessages } from '@/src/graphql/queries';
import { ActivityIndicator } from 'react-native-paper';
import { onCreateMessage } from '../src/graphql/subscriptions';
import ChatRoomHeader from '@/components/ChatRoomHeader';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';

type MessageType = {
  id: string;
  content: string;
  userID: string;
  createdAt: string;
  chatroomID: string;
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
type RootStackParamList = {
  ChatRoomScreen: { id: string };
};

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
        setMessages((existingMessages) => {
          const updatedMessages = [newMessage, ...existingMessages];
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
    setLoadingMessages(true);
    try {
      const messagesResponse = (await API.graphql({
        query: listMessages,
        variables: {
          filter: { chatroomID: { eq: chatRoom?.id } },
          limit: 100,
        },
      })) as ListMessagesResponse;

      const fetchedMessages = messagesResponse?.data?.listMessages?.items || [];
      const sortedMessages = fetchedMessages.sort((b, a) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to fetch messages.');
    } finally {
      setLoadingMessages(false);
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

        const users: ChatRoomUser[] = chatRoomUsersResponse?.data?.listChatRoomUsers?.items || [];
        const fetchedUsers = users
          .map((chatRoomUser) => chatRoomUser.user)
          .filter((u) => u.id !== authUser.attributes.sub);

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
        <Message message={item} isFirst={index === 0} isSameUser={index > 0 && item.userID === messages[index + 1]?.userID} />
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
            <Text style={{ fontSize: 25, margin: 10, fontWeight: 'bold', color: isDarkMode ? '#fff' : '#000' }}>
              {user?.name}
            </Text>
           {/* <Text style={{alignSelf:"center",fontSize:15,padding:12,color: isDarkMode ? '#fff' : '#000',}}>{user?.phonenumber}</Text>*/}
          </View>
        }
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20, color: isDarkMode ? '#BBBBBB' : 'gray' }}>
            No Messages Yet!
          </Text>
        )}
      />
      <MessageInput chatRoom={chatRoom} />
    </View>
  );
};

export default ChatRoomScreen;
