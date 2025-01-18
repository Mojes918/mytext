import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Text,
  View,
  Animated,
  TextInput,
  ImageBackground,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { API, Auth } from 'aws-amplify';
import { getUser, listChatRoomUsers } from '@/src/graphql/queries';
import { getChatRoom } from '@/src/graphql/queries';
import PopMenu from '@/components/Menu/PopMenu';
import ChatListItem from '@/components/ChatList/ChatListItem';
import { MenuProvider } from 'react-native-popup-menu';
import First from '@/components/HomeButtons/First'; // Import First component
import menuItems from '@/components/MenuItem';
import SearchBarAnimation from '@/components/search/SearchBarAnimation';



const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';
interface ChatRoomUser {
  chatRoomId: string;
  userId: string;
}

interface ListChatRoomUsersResponse {
  listChatRoomUsers: {
    items: ChatRoomUser[];
    nextToken: string | null;
  };
}

export interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
  imagepath: string | null;
}

export interface Message {
  content: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  newMessages: number;
  lastMessage: Message | null;
  users: User[];
}

function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [type,setType]=useState('first');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [selectedImage, setSelectedImage] = useState(null);






  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        const userId = userData.attributes.sub;
  
        const chatRoomUsersResponse = (await API.graphql({
          query: listChatRoomUsers,
          variables: {
            filter: { userId: { eq: userId } },
            limit: 100,
          },
        })) as any;
  
        const chatRoomsData = chatRoomUsersResponse.data?.listChatRoomUsers.items;
        if (chatRoomsData?.length) {
          const chatRoomIds = chatRoomsData
            .map((chatRoomUser) => chatRoomUser.chatRoomId)
            .filter(Boolean);
  
          const fetchedChatRooms = await Promise.all(
            chatRoomIds.map(async (chatRoomId) => {
              const chatRoomResponse = await API.graphql({
                query: getChatRoom,
                variables: { id: chatRoomId },
              });
              return chatRoomResponse.data?.getChatRoom || null;
            })
          );
  
          const sortedChatRooms = fetchedChatRooms
          .filter(Boolean)
          .sort((a, b) => {
            const aTime = a.LastMessage?.createdAt
              ? new Date(a.LastMessage.createdAt).getTime()
              : 0;
            const bTime = b.LastMessage?.createdAt
              ? new Date(b.LastMessage.createdAt).getTime()
              : 0;
        
            // Sort by unread messages first, then by timestamp
            if (a.newMessages !== b.newMessages) {
              return b.newMessages - a.newMessages;
            }
        
            return bTime - aTime;
          });
        
         // console.log('Fetched ChatRooms (Before Sorting):', fetchedChatRooms);
          //console.log('Sorted ChatRooms (After Sorting):', sortedChatRooms);
  
          setChatRooms([...sortedChatRooms]);
        }
  
        const userHeaderDetails: any = await API.graphql({
          query: getUser,
          variables: {
            id: userId,
          },
        });
  
        if (userHeaderDetails?.data?.getUser) {
          const userDetails = userHeaderDetails.data.getUser;
          setCurrentUser({
            id: userDetails.id,
            name: userDetails.name || 'User',
            imagepath: userDetails.imageUri || null,
          });
        }
      } catch (error) {
        console.error('Error fetching chat rooms or user data:', error);
      }
    };
  
    fetchChatRooms();
  }, []);
  
     
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#111' : '#ffffff',
      flex: 1,
      paddingHorizontal: 5,
      paddingVertical: 10,
    },
    headerText: {
      fontSize: 15,
      fontWeight: '500',
      color: isDarkMode ? 'white' : 'black',
    },
    image: {
      height: 40,
      width: 40,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#565656',
    },
    fullscreenImage: {
      width: '90%',
      height: '90%',
      resizeMode: 'contain',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  });

  const textColor= isDarkMode ? 'white' : 'black'
  
  const iconColor = isDarkMode ? '#ffffff' : '#000000';
  const ProfileRoute = () => router.push('/(tabs)/settings');
  
  

    
  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);

    Animated.timing(animatedWidth, {
      toValue: isSearchActive ? 0 : 1, // 0 for retracted, 1 for expanded
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const interpolatedWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['90%', '100%'], // 90% is for normal, 100% when expanded
  });

  
  return (
    <MenuProvider>
      <View style={dynamicStyles.container}>
        <StatusBar backgroundColor={dynamicStyles.container.backgroundColor} />
        <View
          style={{
            width: '100%',
            height: 50,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}
        >
            {!isSearchActive && (
              <>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          
            <TouchableOpacity onPress={ProfileRoute}>
              <Image
                source={currentUser?.imagepath ? { uri: currentUser.imagepath } : { uri: defaultImage }}
                style={dynamicStyles.image}
              />
            </TouchableOpacity>
            <Text style={dynamicStyles.headerText}>{currentUser?.name || 'Loading...'}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleSearch}>
            <AntDesign name="search1" size={24} color={iconColor} />
            </TouchableOpacity>
            <PopMenu menuItems={menuItems} />
          </View>
          </>
          )}
          {isSearchActive && (
          <Animated.View style={[styles.searchBar, { width: interpolatedWidth }]}>
            <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#fff"
            />
          </Animated.View>
        )}
        </View>


        {/* Fullscreen Modal for Enlarged Profile Picture */}
        {selectedImage && (
          <Modal visible={true} transparent={true} animationType="fade">
            <TouchableOpacity
              style={dynamicStyles.modalBackground}
              onPress={() => setSelectedImage(null)}
            >
              <Image source={{ uri: selectedImage }} style={dynamicStyles.fullscreenImage} />
            </TouchableOpacity>
          </Modal>
        )}

        {/* FlatList */}
        <FlatList
  data={chatRooms}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => item ? <ChatListItem chatRoom={item} /> : null}
  ListHeaderComponent={() => (
    <>
    <Text style={[dynamicStyles.headerText, { paddingHorizontal: 15, marginTop: 10 }]}>
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

      </View>

      {/* Floating Action Button at the Top */}
      {type === 'first' && <First />}
    </MenuProvider>
  );
}

export default HomeScreen;


const styles=StyleSheet.create({


searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 25,
  overflow: 'hidden',
},
input: {
  flex: 1,
  paddingLeft: 15,
  fontSize: 16,
  color: '#333',
},
searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#333',
  borderRadius: 20,
  borderColor:"#333",
  borderWidth:1,
  paddingHorizontal: 10,
},
searchInput: {
  flex: 1,
  height: 40,
  fontSize: 16,
  color: '#fff',
  marginLeft: 10,

},
})