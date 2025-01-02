import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  useWindowDimensions, 
  Image, 
  StyleSheet, 
  Pressable, 
  Appearance, 
  Alert
} from 'react-native';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { API, Auth } from 'aws-amplify';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';
import * as ImagePicker from 'expo-image-picker';
interface ChatRoomUser {
  id: string;
  chatRoomId: string;
  userId: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
}

const ChatRoomHeader = ({ id }: { id: any }) => {
  
  const [user, setUser] = useState<User | null>(null);

 const [image, setImage] = useState<string | null>(null);
  // Detect system color scheme
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    if (!id) return;

    const fetchUsers = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        const chatRoomUsersResponse = await API.graphql({
          query: listChatRoomUsersWithDetails,
          variables: { filter: { chatRoomId: { eq: id } } },
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
  }, [id]);

  const backbutton = () => {
    // Handle back button press
    console.log('Back button pressed');
  };



  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  

  

  return (
    <View 
      style={[
        styles.container, 
        { 
          width:"auto", 
          backgroundColor: isDarkMode ? '#121212' : '#ffffff' 
        }
      ]}
    >
     {/* <Pressable onPress={backbutton}>
        <Ionicons 
          name="arrow-back-outline" 
          size={24} 
          color={isDarkMode ? '#ffffff' : '#000000'} 
        />
      </Pressable>*/}
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: user?.imageUri || 'https://via.placeholder.com/30' }}
          style={[styles.userImage, { backgroundColor: isDarkMode ? '#303030' : '#CCCCCC' }]}
        />
        <Text 
          style={[styles.userName, { color: isDarkMode ? '#ffffff' : '#333333' }]} 
          numberOfLines={1}
        >
          {user?.name || 'Loading...'}
        </Text>
        
        <View style={styles.iconsContainer}>
          {/*
        <Feather 
            name="video" 
            size={24} 
            color={isDarkMode ? '#fff' : '#007AFF'} 
            style={styles.icon} 
          />
          <Ionicons 
            name="call-outline" 
            size={24} 
            color={isDarkMode ? '#fff' : '#007AFF'} 
            style={styles.icon} 
          />*/}
          <Feather name="camera" size={24}  color={isDarkMode ? '#fff' : '#007AFF'} 
            style={styles.icon}  onPress={takePhoto}/>
          <Entypo 
            name="dots-three-vertical" 
            size={20} 
            color={isDarkMode ? '#fff' : '#007AFF'} 
            style={styles.icon} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
    gap:10
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft:-30,
  
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ChatRoomHeader;
