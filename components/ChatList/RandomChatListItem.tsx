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
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getRandomMessage, getUser, listRandomChatRoomUsers } from '@/src/graphql/queries';


const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

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

export default function RandomChatListItem({ chatRoom }: { chatRoom: ChatRoom }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const [newMessages, setNewMessages] = useState<number>(0); // State for unread messages count
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  
//console.log(user);
const fetchUser = async () => {
  try {
    const authUser = await Auth.currentAuthenticatedUser();
    const authUserId = authUser.attributes.sub;

    // Fetch users in the chatroom
    const chatRoomUsersData = await API.graphql(
      graphqlOperation(listRandomChatRoomUsers, {
        filter: { chatRoomId: { eq: chatRoom.id } },
      })
    );

    //console.log("ChatRoomUsers:", chatRoomUsersData);

    const users = chatRoomUsersData.data?.listRandomChatRoomUsers?.items || [];
    const otherUser = users.find((u) => u.userId !== authUserId);


    //console.log("Other User:", otherUser);

    if (!otherUser) {
      console.error("No other user found in the chatroom.");
      return;
    }

    // Fetch User details
    const userData = await API.graphql(
      graphqlOperation(getUser, { id: otherUser.userId }) // ✅ Corrected
    );

    //console.log("Fetched User:", userData);

    const fetchedUser = userData.data?.getUser;
    setUser(fetchedUser);
  } catch (error) {
    //console.error("Error fetching user:", error);
  }
};
useEffect(() => {
  fetchUser();
}, [chatRoom.id]); // ✅ Runs when chatRoom changes

 useEffect(() => {
    const fetchLastMessage = async () => {
      if (!chatRoom.chatRoomLastMessageId) return;
      try {
        const response = await API.graphql({
          query: getRandomMessage,
          variables: { id: chatRoom.chatRoomLastMessageId },
        });
        setLastMessage(response.data.getRandomMessage);
      } catch (error) {
        console.error('Error fetching last message:', error);
      }
    };

    fetchLastMessage();
  }, [chatRoom.chatRoomLastMessageId]);

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
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
        {/* Profile Image Placeholder */}
        <Image
          source={{ uri: defaultImage }}
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
  
 const handleChatOpen = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const userId = authUser.attributes.sub;
      router.push({ pathname:'/OnlineChatRoom', params: { chatRoomId: chatRoom?.id ,userId:user?.id} });
      
    setLastMessage(prev => prev ? { ...prev, status: "READ" } : prev);

      
    } catch (error) {
      console.error("Error resetting unread count:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleChatOpen}>
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
          <TouchableOpacity onPress={() => openModal(user.imageUri || '')}>
            <Image
              source={{ uri: user.imageUri || defaultImage }}
              style={[styles.image, { borderColor: isDarkMode ? '#666' : '#ccc' }]}
            />
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#000' }]}>{user.name}</Text>
              <Text style={[styles.timestamp, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {formatTime(lastMessage?.createdAt)}
              </Text>
            </View>
            <Text style={[styles.messagePreview, { 
      color: lastMessage?.userID === user?.id && lastMessage?.status!=='READ' 
        ? (isDarkMode ? '#EAEAEA':'#333333') 
        : (isDarkMode ? '#aaa' : '#666'),
      marginTop: 2
    }]} numberOfLines={1}>
              {lastMessage?.content }
               
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
                      <Image source={{ uri: selectedImage || defaultImage }} style={styles.fullscreenImage} resizeMode='cover'/>
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
    paddingVertical:15,
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 23,
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
  name: { fontWeight: '500', fontSize: 15 },
  timestamp: { fontSize: 12 },
  messagePreview: { fontSize: 12 },
  loader: { padding: 20, alignItems: 'center' },
  text: { fontSize: 16 },
  modalOverlay: {  backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
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
    left: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  messageIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 60,
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
