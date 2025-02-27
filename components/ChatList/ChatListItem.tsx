import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API, Auth } from 'aws-amplify';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';
import { getMessage, listUnreadMessages } from '@/src/graphql/queries';
// Icon Libraries
import { MaterialCommunityIcons } from '@expo/vector-icons';



interface Message {
  content?: string;
  createdAt?: string;
  image?: string;
  audio?: string;
}

interface User {
  id: string;
  name: string;
  imageUri?: string;
}

interface ChatRoom {
  id: string;
  newMessages: number;
  LastMessage: Message | null;
  chatRoomLastMessageId?: string;
}

export default function ChatListItem({ chatRoom }: { chatRoom: ChatRoom})  {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
//console.log(chatRoom);
//console.log(unreadCount)
  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const [newMessages, setNewMessages] = useState<number>(); // State for unread messages count
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
//console.log(chatRoom);
//console.log(unreadCount);
//console.log(newMessages);
  
  const handleChatOpen = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const userId = authUser.attributes.sub;
      router.push({ pathname: "/ChatRoomScreen", params: { ChatRoomId: chatRoom.id } });
      if (newMessages > 0) {
        setNewMessages(0); // Reset the badge count in UI
      }
       // Update lastMessage status in the UI
    setLastMessage(prev => prev ? { ...prev, status: "READ" } : prev);

      
    } catch (error) {
      console.error("Error resetting unread count:", error);
    }
  };

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!chatRoom.chatRoomLastMessageId) return;
      try {
        const response = await API.graphql({
          query: getMessage,
          variables: { id: chatRoom.chatRoomLastMessageId },
        });
        setLastMessage(response.data.getMessage);
      } catch (error) {
        console.error('Error fetching last message:', error);
      }
    };

    fetchLastMessage();
  }, [chatRoom.chatRoomLastMessageId]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.graphql({
          query: listChatRoomUsersWithDetails,
          variables: { filter: { chatRoomId: { eq: chatRoom.id } } },
        });
        const users = response.data.listChatRoomUsers.items.map(item => item.user);
        const authUser = await Auth.currentAuthenticatedUser();
        const otherUsers = users.filter(u => u.id !== authUser.attributes.sub);
        setUser(otherUsers[0] || null);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [chatRoom.id]);


  
  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      try {
  
        const authUser = await Auth.currentAuthenticatedUser();
        const userId = authUser.attributes.sub;
  
        const unreadMessagesResponse = await API.graphql({
          query: listUnreadMessages,
          variables: {
            filter: { chatRoomId: { eq: chatRoom.id }, userId: { eq: userId } },
            limit: 100,
          },
        });
  
        const unreadMessages = unreadMessagesResponse.data?.listUnreadMessages.items || [];
        const totalUnreadMessages = unreadMessages.reduce((total, item) => total + item.newMessages, 0);
  
        setNewMessages(totalUnreadMessages);
    
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };
  
    fetchUnreadMessagesCount();
  }, [chatRoom.id,newMessages]);


  
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const openModal = (imageUri: string) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };
  const defaultImage=require("../../assets/images/default.jpg");
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
        {/* Profile Image Placeholder */}
        <Image
          source={ defaultImage }
          style={[styles.image, { borderColor: isDarkMode ? '#666' : '#ccc' }]}
        />
  
        <View style={styles.infoContainer}>
          {/* Name Placeholder */}
          <View style={[styles.skeletonLine,{backgroundColor:isDarkMode?"#555":"#ccc"}]} />
  
          {/* Timestamp Placeholder */}
          <View style={[styles.skeletonLine, { width: 80, marginTop: 5 ,backgroundColor:isDarkMode?"#555":"#ccc"}]} />
        </View>
      </View>
    );
  }


 
  return (
    <View>
      <TouchableOpacity onPress={handleChatOpen}>
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
          <TouchableOpacity onPress={() => openModal(user.imageUri || '')}>
            <Image
              source={user?.imageUri?{ uri:user?.imageUri}:defaultImage}
              style={[styles.image, { borderColor: isDarkMode ? '#666' : '#ccc' }]}
            />
          </TouchableOpacity>
          {newMessages > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{newMessages}</Text>
            </View>
          ) : null}
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#000' }]}>{user.name}</Text>
              <Text style={[styles.timestamp, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {formatTime(lastMessage?.createdAt)}
              </Text>
            </View>
            
            <Text
  style={[
    styles.messagePreview,
    { 
      color: lastMessage?.userID === user?.id && lastMessage?.status!=='READ' 
        ? (isDarkMode ? '#87CEEB' : '#4682B4') 
        : (isDarkMode ? '#aaa' : '#666'),
      marginTop: 2
    }
  ]}
  numberOfLines={1}
>
  {lastMessage?.content ||
    (lastMessage?.image && <Text>Photo 🖼️</Text>) ||
    (lastMessage?.audio && (
      <>
        <MaterialCommunityIcons name="microphone-outline" size={14} />
        <Text>Voice Message 🎧</Text>
      </>
    )) ||
    "No Message yet"}
</Text>

          </View>
        </View>
      </TouchableOpacity>

      {/* Full-Screen Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <View>
                <Image source={{ uri: selectedImage || defaultImage }} style={styles.fullscreenImage} resizeMode="cover" />
               {/* <TouchableOpacity
                  style={styles.profileIconContainer}
                  onPress={() => {
                    closeModal();
                    router.push({ pathname: '/ProfileScreen', params: { id: user?.id } });
                  }}
                >
                  <MaterialCommunityIcons name="account-circle-outline" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.messageIconContainer}
                  onPress={() => {
                    closeModal();
                    router.push(`/ChatRoomScreen?id=${chatRoom.id}`);
                  }}
                >
                  <MaterialCommunityIcons name="message-text-outline" size={30} color="#fff" />
                </TouchableOpacity>*/}
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal:5,
    paddingVertical:12,
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    left: 50,
    top: 10,
    backgroundColor: '#3777f0',
    height: 18,
    width: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  infoContainer: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '500', fontSize: 16 },
  timestamp: { fontSize: 12 },
  messagePreview: { fontSize: 14 },
  loader: { padding: 20, alignItems: 'center' },
  text: { fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', height: '90%', justifyContent: 'center', alignItems: 'center' },
  fullscreenImage: { 
    width: 300, 
    height: 300, 
    borderRadius: 150, // Ensures a perfect circle
    borderWidth: 2, 
    borderColor: '#fff', // Adds a white border for better visibility
  },
  profileIconContainer: {
    position: 'absolute',
    bottom: 0,
    left: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  messageIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  skeletonLine: {
    height: 14,
   
    borderRadius: 5,
    width: '60%',
  },
  
});
