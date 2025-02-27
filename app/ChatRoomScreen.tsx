import React, { useCallback, useEffect,useRef, useState } from 'react';
import { View, Text, FlatList, useColorScheme, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Message from '@/components/Message/Message';
import MessageInput from '@/components/Message/MessageInput';
import { useRoute } from '@react-navigation/native';
import { API, Auth, graphqlOperation} from 'aws-amplify';
import { GET_CHATROOM,LIST_MESSAGES, UPDATE_MESSAGE } from '@/src/graphql/operations';
import { ActivityIndicator } from 'react-native-paper';
import { LIST_CHAT_ROOM_USERS_WITH_DETAILS } from '@/src/CustomQuery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApolloClient,useQuery } from '@apollo/client';
import { onCreateMessage } from '@/src/graphql/subscriptions';
import { listUnreadMessages } from '@/src/graphql/queries';
import { deleteUnreadMessages, updateUnreadMessages } from '@/src/graphql/mutations';
import SkeletonMessageItem from '@/components/shimmereffect';
type MessageType = {
  id: string;
  content: string;
  userID: string;
  createdAt: string;
  chatroomID: string;
  status: string;
  replyToMessageID: string;
};

interface User {
  id: string;
  name: string;
  imageUri?: string;
}

type ChatRoomType = {
  id: string;
  newMessages: number;
  messages: MessageType[];
};


const ChatRoomScreen = () => {
  const route=useRoute();
  const {ChatRoomId}=useLocalSearchParams();
 // console.log("ChatRoomId",ChatRoomId);
  const router = useRouter();
  const client = useApolloClient();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  //console.log("🚀 ChatRoomScreen route params:", route.params);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messageReply, setMessageReply] = useState<MessageType | null>(null);
  const [viewableMessageIds, setViewableMessageIds] = useState<string[]>([]);
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [unreadMessagesRecord, setUnreadMessagesRecord] = useState(null);

  
  
   useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setAuthUserId(authUser.attributes.sub);
      } catch (error) {
        console.error('Error fetching auth user:', error);
      }
    };
    fetchAuthUser();
  }, []);

  const { data: chatUsersData, loading: chatUsersLoading, error: chatUsersError } = useQuery(LIST_CHAT_ROOM_USERS_WITH_DETAILS, {
    variables: { filter: { chatRoomId: { eq: ChatRoomId } } }, // ✅ Correct filter format
    fetchPolicy: 'cache-and-network',
  });
  
//console.log("chatUsersData",chatUsersData);

useEffect(() => {
  if (authUserId && chatUsersData) {
    const chatRoomUsers = chatUsersData?.listChatRoomUsers?.items || [];
    const fetchedUser = chatRoomUsers
      .map((chatRoomUser) => chatRoomUser.user)
      .find((u) => u.id !== authUserId);
    setUser(fetchedUser || null);
  }
}, [chatUsersData, authUserId]);


  // ✅ Fetch Chatroom Details
  const { data: chatRoomData, loading: chatRoomLoading } = useQuery(GET_CHATROOM, {
    variables: { id: ChatRoomId },
    fetchPolicy: 'cache-and-network',
  });

  const chatRoom = chatRoomData?.getChatRoom;



  const { data:messagesData, loading, error } = useQuery(LIST_MESSAGES, {
    variables: {
      filter: { chatroomID: { eq: ChatRoomId } }, // ✅ Ensure correct filtering
      limit: 1000,
    },
    fetchPolicy: 'cache-and-network', // ✅ Uses cache but also fetches from DB
  });
  

  
  useEffect(() => {
    if (messagesData?.listMessages?.items) {
      setMessages(
        [...messagesData.listMessages.items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  }, [messagesData]);
 
 // Fetch unread messages when entering the chatroom
 useEffect(() => {
  const fetchUnreadMessages = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const userId = userData.attributes.sub;

      const response = await API.graphql({
        query: listUnreadMessages,
        variables: {
          filter: { chatRoomId: { eq: ChatRoomId }, userId: { eq: userId } },
          limit: 1,
        },
      });

      const unreadRecord = response.data?.listUnreadMessages?.items[0] || null;
      setUnreadMessagesRecord(unreadRecord);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };
  fetchUnreadMessages();
}, [ChatRoomId]);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateMessage, { chatroomID: ChatRoomId }))
      .subscribe({
        next: ({ value }) => {
          const newMessage = value?.data?.onCreateMessage;
          if (newMessage) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
          }
        },
        error: (error) => console.error("❌ Subscription Error:", error),
      });
  
    return () => subscription.unsubscribe(); // Cleanup on unmount
  }, [ChatRoomId]);
  


  
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setViewableMessageIds((prevIds) => {
      const newIds = [...new Set([...prevIds, ...viewableItems.map((item) => item.item.id)])];
      return newIds.length !== prevIds.length ? newIds : prevIds; // Prevent unnecessary re-renders
    });
  }, []);
  

  // ✅ Mark Messages as Read
  useEffect(() => {
    if (viewableMessageIds.length > 0) {
      markMessagesAsRead(viewableMessageIds);
    }
  }, [viewableMessageIds]);

  const markMessagesAsRead = async (messageIds: string[]) => {
    if (!authUserId || messageIds.length === 0) return;
  
    try {
      // Step 1: Update message statuses to "READ"
      const unreadMessages = messages
        .filter((msg) => messageIds.includes(msg.id) && msg.userID !== authUserId && msg.status !== "READ")
        .map((msg) => ({ id: msg.id, status: "READ" }));
  
      await Promise.all(
        unreadMessages.map(async (msg) => {
          await API.graphql({
            query: UPDATE_MESSAGE,
            variables: { input: msg },
          });
  
          // ✅ Update Apollo cache immediately
          client.cache.modify({
            id: client.cache.identify(msg),
            fields: {
              status() {
                return "READ";
              },
            },
          });
        })
      );

       // Update unreadMessages and ChatRoom to 0
       if (unreadMessagesRecord) {
        await API.graphql({
          query: updateUnreadMessages,
          variables: { input: { id: unreadMessagesRecord.id, newMessages: 0 } },
        });

        

        // Delete unreadMessages record
        await API.graphql({
          query: deleteUnreadMessages,
          variables: { input: { id: unreadMessagesRecord.id } },
        });

        setUnreadMessagesRecord(null); // Remove local reference

      }
     // console.log("✅ Messages marked as read and unreadMessages deleted");
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  };
  
  
  
  if (chatRoomLoading) return <ActivityIndicator size="large" />;


  

  const renderItem = ({ item, index }) => {
    if (loading || !item) return <SkeletonMessageItem isSent={index % 2 === 0} />
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
        <Message  message={item}  setAsMessageReply={() => setMessageReply(item)} authUserId={authUserId} messageReply={messageReply} fetchUser={user}/>
        
      </View>
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator size="large" />;
  }

  const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';
  return (
    <View style={{ backgroundColor: isDarkMode ? '#121212' : 'white', flex: 1 }}>
      
      <FlatList
        data={messages} // 10 skeletons if loading
        keyExtractor={(item, index) => (item ? item.id : `skeleton-${index}`)}
        ref={flatListRef}
        inverted
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // Mark message as seen if 50% is visible
        }}
        
        initialNumToRender={30}
        maxToRenderPerBatch={10}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: 60, // Approximate message height
          offset: 60 * index,
          index,
        })}        
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 20 }}
        ListFooterComponent={
<TouchableOpacity style={{ alignItems: 'center', margin: 80 }} onPress={()=>router.push({pathname:'/ProfileScreen',params:{id:user?.id}})}>
            <Image
              source={{ uri: user?.imageUri || defaultImage }}
              style={{ height: 120, width: 120, borderRadius: 60 }}
            />
            <Text style={{ fontSize: 25, margin: 10, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
              {user?.name}
            </Text>
          </TouchableOpacity>
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

