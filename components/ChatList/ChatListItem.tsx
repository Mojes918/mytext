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
} from 'react-native';
import { useRouter } from 'expo-router';
import { API, Auth } from 'aws-amplify';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';
import { getMessage } from '@/src/graphql/queries';

// Icon Libraries
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';
// Interfaces
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
  lastMessage: Message | null;
  chatRoomLastMessageId?: string;
}

// Main Component
export default function ChatListItem({ chatRoom }: { chatRoom: ChatRoom }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        const response = await API.graphql({
          query: listChatRoomUsersWithDetails,
          variables: { filter: { chatRoomId: { eq: chatRoom.id } } },
        });

        const users = response?.data?.listChatRoomUsers?.items.map(
          (item: any) => item.user
        ) || [];
        const otherUsers = users.filter((u: User) => u.id !== authUser.attributes.sub);
        setUser(otherUsers[0] || null);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [chatRoom.id]);

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!chatRoom.chatRoomLastMessageId) return;
      try {
        const response = await API.graphql({
          query: getMessage,
          variables: { id: chatRoom.chatRoomLastMessageId },
        });
        setLastMessage(response?.data?.getMessage || null);
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
      <View style={styles.loader}>
        <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => router.push(`/ChatRoomScreen?id=${chatRoom.id}`)}>
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#fff' }]}>
          <TouchableOpacity onPress={() => openModal(user.imageUri || '')}>
            <Image
              source={{ uri: user.imageUri || defaultImage}  }
              style={[styles.image, { borderColor: isDarkMode ? '#666' : '#ccc' }]}
            />
          </TouchableOpacity>
          {chatRoom.newMessages > 0 ? (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
  </View>
) : null}
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#000' }]}>{user.name}</Text>
              <Text style={[styles.timestamp, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {formatTime(lastMessage?.createdAt)}
              </Text>
            </View>
            <Text style={[styles.messagePreview, { color: isDarkMode ? '#aaa' : '#666' }]}>
              {lastMessage?.content ||
                (lastMessage?.image && (
                  <>
                    <Text>Photo </Text>
                    <Feather name="image" size={14} />
                  </>
                )) ||
                (lastMessage?.audio && (
                  <>
                    <Text>Voice Message </Text>
                    <MaterialCommunityIcons name="microphone-outline" size={14} />
                  </>
                )) ||
                'No message yet'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Full-Screen Modal */}
     {/* Full-Screen Modal */}
{/* Full-Screen Modal */}
<Modal
  visible={isModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={closeModal}
>
  <Pressable style={styles.modalOverlay} onPress={closeModal}>
    <View style={styles.modalContent}>
      {selectedImage && (
        <View>
          {/* Display the Image */}
          <Image
            source={{ uri: selectedImage|| defaultImage }}
            style={styles.fullscreenImage}
            resizeMode="cover"
          />
          
          {/* Profile Icon */}
          <TouchableOpacity
            style={styles.profileIconContainer}
            onPress={() => {
              closeModal();
              router.push({
                pathname:"/ProfileScreen",
                params:{id:user?.id}
              });
            }}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
          
          {/* Message Icon */}
          <TouchableOpacity
            style={styles.messageIconContainer}
            onPress={() => {
              closeModal();
              router.push(`/ChatRoomScreen?id=${chatRoom.id}`);
            }}
          >
            <MaterialCommunityIcons
              name="message-text-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </Pressable>
</Modal>


    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    height: 52,
    width: 52,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ccc',
    position: 'relative', // Ensure relative positioning
  },
  badge: {
    position: 'absolute',
    left: 50, // Adjust as needed
    top: 10,  // Adjust as needed
    backgroundColor: '#3777f0',
    height: 18,
    width: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  
  infoContainer: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '600', fontSize: 16 },
  timestamp: { fontSize: 12 },
  messagePreview: { fontSize: 14 },
  loader: { padding: 20, alignItems: 'center' },
  text: { fontSize: 16 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: 250, // Fixed width
    height: 300, // Fixed height
    borderRadius:10, // Optional for rounded corners
  },
  profileIconContainer: {
    position: 'absolute',
    bottom: 0, // Adjust position as needed
    left:60, // Adjust position as needed
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  messageIconContainer: {
    position: 'absolute',
    bottom: 0, // Adjust position as needed
    right: 60, // Adjust position as needed
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
});
