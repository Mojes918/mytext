import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  Text,
  View,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API, Auth} from 'aws-amplify';
import ChatListItem from '@/components/ChatList/ChatListItem';
import First from '@/components/HomeButtons/First';
import { dynamicStyles } from "../styles/styles";
import { User, ChatRoom, } from '../types/types';
import { onCreateMessage } from '@/src/graphql/subscriptions';
import { getChatRoom, getMessage, getUser, listChatRoomUsers, listUnreadMessages } from '@/src/graphql/queries';
import { useFocusEffect } from '@react-navigation/native';
import { showInAppNotification } from '@/components/InAppNotification';

function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [type, setType] = useState('first');
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);



  const fetchChatRooms = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const userId = userData.attributes.sub;
  
      const chatRoomUsersResponse = await API.graphql({
        query: listChatRoomUsers,
        variables: {
          filter: { userId: { eq: userId } },
          limit: 100,
        },
      }) as any;
  
      const chatRoomsData = chatRoomUsersResponse.data?.listChatRoomUsers.items || [];
      if (!chatRoomsData.length) return;
  
      const chatRoomIds = chatRoomsData.map((chatRoomUser) => chatRoomUser.chatRoomId).filter(Boolean);
  
      const fetchedChatRooms = await Promise.all(
        chatRoomIds.map(async (chatRoomId) => {
          const chatRoomResponse = await API.graphql({
            query: getChatRoom,
            variables: { id: chatRoomId },
          });
  
          const chatRoom = chatRoomResponse.data?.getChatRoom;
          if (!chatRoom) return null;
  
          let lastMessage = null;
          if (chatRoom.chatRoomLastMessageId) {
            const lastMessageResponse = await API.graphql({
              query: getMessage,
              variables: { id: chatRoom.chatRoomLastMessageId },
            });
            lastMessage = lastMessageResponse?.data?.getMessage || null;
          }
  
          // Fetch unread messages count for each chat room
          const unreadMessagesData = await API.graphql({
            query: listUnreadMessages,
            variables: {
              filter: { chatRoomId: { eq: chatRoomId }, userId: { eq: userId } },
              limit: 1,
            },
          });
  
          const unreadMessages = unreadMessagesData.data?.listUnreadMessages.items[0] || null;
          const unreadCount = unreadMessages ? unreadMessages.newMessages : 0;
  
          return {
            ...chatRoom,
            LastMessage: lastMessage,
            unreadCount, // Adding unread messages count
          };
        })
      );
  
      // 🔥 **Sorting Logic**
      const sortedChatRooms = fetchedChatRooms
        .filter(Boolean)
        .sort((a, b) => {
          if (b.unreadCount !== a.unreadCount) {
            return b.unreadCount - a.unreadCount; // Sort by unread messages count
          }
          const aTime = a.LastMessage?.createdAt ? new Date(a.LastMessage.createdAt).getTime() : 0;
          const bTime = b.LastMessage?.createdAt ? new Date(b.LastMessage.createdAt).getTime() : 0;
          return bTime - aTime; // Sort by last message timestamp
        });
  
      setChatRooms(sortedChatRooms);
    } catch (error) {
      console.error("Error fetching chat rooms", error);
    }
  };
  
      
  useFocusEffect(
    React.useCallback(() => {
      fetchChatRooms();
    }, [chatRooms]) // ✅ Adding chatRooms as a dependency ensures re-fetching when data updates
  );
  



useEffect(() => {
  const fetchUserId = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      //console.log(user.attributes.sub);
      setUserId(user.attributes.sub); 
    } catch (error) {
      console.error("Error fetching user ID: ", error);
    }
  };
  
  fetchUserId();
}, []); 


useEffect(() => {
  if (!userId) return;
  API.graphql({ query: getUser, variables: { id: userId } })
    .then(response => {
      const user = response.data?.getUser;
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.name || "User",
          imagepath: user.imageUri || null,
        });
      }
    })
    .catch(error => console.error("Error fetching user data", error));
}, [userId]);


useEffect(() => {
  const subscription = API.graphql({
    query: onCreateMessage,
  }).subscribe({
    next: async ({ value }) => {
      try {
        const newMessage = value.data.onCreateMessage;
        setChatRooms((prev) =>
          prev.map((room) =>
            room.id === newMessage.chatroomID
              ? { ...room, LastMessage: newMessage }
              : room
          )
        );
      } catch (error) {
        console.error("Error handling new message:", error);
      }
      try {
        const newMessage = value.data.onCreateMessage;
//console.log(newMessage);
        // Get current user ID
        const userData = await Auth.currentAuthenticatedUser();
        const currentUserId = userData.attributes.sub;

        if (newMessage.userID === currentUserId) {
          return; // Ignore notifications for the sender
        }
        
        if (!newMessage.userID) {
          console.error("Error: Sender User ID is null");
          return;
        }
        
        
         // Fetch sender's details
         const senderResponse = await API.graphql({
          query: getUser,
          variables: { id: newMessage.userID },
        });
        const sender = senderResponse.data?.getUser;
        const senderName = sender?.name || "Someone";

        // Show notification with sender's name and message content
        showInAppNotification(`${senderName}: ${newMessage.content}`);

        if (!newMessage.chatroomID) {
          console.error("Error: Chatroom ID is null");
          return;
        }
        
        // Update chat room list with the new message count
        fetchChatRooms(); // Fetch updated chat rooms if necessary
    
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    },
    error: (error) => console.error("Subscription error:", error),
  });

  return () => {
    subscription.unsubscribe();
    
  };
}, []);



const defaultImage=require("../../assets/images/default.jpg");

  const textColor = isDarkMode ? 'white' : 'black'
  const headerColor = isDarkMode ? "#ddd" : "#256ffa"
  //const ProfileRoute = () => router.push('/(tabs)/settings');

  const styles = dynamicStyles(isDarkMode);
  return (

    <View style={styles.container}>
      <StatusBar backgroundColor={styles.container.backgroundColor} />
      <View
        style={{
          width: '100%',
          height: 50,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 7,
        }}
      >

        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>

          <TouchableOpacity onPress={()=>router.push('/(tabs)/settings')}>
            <Image
              source={currentUser?.imagepath ? { uri: currentUser.imagepath } : defaultImage }
              style={styles.image}
              defaultSource={require('../../assets/images/default.jpg')}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, { fontWeight: "500" }]}>{currentUser?.name || 'Hello,MyChat'}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 22,color: headerColor, fontWeight: "700" }}>MYCHAT</Text>
        </View>

      </View>
      {selectedImage && (
        <Modal visible={true} transparent={true} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
            <View style={styles.modalBackground}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsFullScreen((prev) => !prev)} // Toggle full-screen mode
              >
                <Image
                  source={{ uri: selectedImage }}
                  style={isFullScreen ? styles.fullImage : styles.fullscreenImage}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item ? <ChatListItem chatRoom={item}/> : null}
        ListHeaderComponent={() => (
          <>
            <Text style={[styles.headerText, {  margin: 10 }]}>
              Messages
            </Text></>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
            <Text style={{ fontSize: 16, color: textColor }}>No chats yet.</Text>
            <Text style={{ fontSize: 16, color: textColor }}>Get Started by messaging a friend.</Text>
          </View>
        }
      />
      <First />
    </View>


  );
}

export default HomeScreen;


