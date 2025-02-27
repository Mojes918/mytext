import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Appearance, 
  TouchableOpacity
} from 'react-native';
import { API, Auth } from 'aws-amplify';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';
import { useRouter } from 'expo-router';

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
  lastOnlineAt: number;
}

const ChatRoomHeader = ({ id }: { id: any }) => {
  //console.log(id);
  const [user, setUser] = useState<User | null>(null);
const router=useRouter();
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



//console.log("user ",user);
  
const getUserStatus = (lastOnlineAt: number | null): string => {
  if (!lastOnlineAt || lastOnlineAt <= 0) {
    return 'unknown'; // Fallback if lastOnlineAt is invalid
  }

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const onlineThreshold = 120; // 5 minutes

  if (currentTime - lastOnlineAt <= onlineThreshold) {
    return 'Online';
  }

  const lastSeenDate = new Date(lastOnlineAt * 1000); // Convert to JavaScript Date

  // Format the time (e.g., "3:30 AM")
  const formattedTime = lastSeenDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Check if the last seen was today
  const today = new Date();
  const isToday =
    lastSeenDate.getDate() === today.getDate() &&
    lastSeenDate.getMonth() === today.getMonth() &&
    lastSeenDate.getFullYear() === today.getFullYear();

  if (isToday) {
    return `Last seen at ${formattedTime}`;
  }

  // Format the date if not today (e.g., "Jan 1 at 3:30 AM")
  const formattedDate = lastSeenDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return `Last seen on ${formattedDate} at ${formattedTime}`;
};

const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';


  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}
     
    >
      <View style={styles.userInfoContainer}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}  onPress={()=>router.push({pathname:"/ProfileScreen",params:{id:user?.id}})}>
          <Image
            source={{ uri: user?.imageUri || defaultImage}}
            style={[styles.userImage, { backgroundColor: isDarkMode ? '#303030' : '#CCCCCC' }]}
          />
          <View>
            <Text 
              style={[styles.userName, { color: isDarkMode ? '#ffffff' : '#333333' }]} 
              numberOfLines={1}
            >
              {user?.name || 'Loading...'}
            </Text>
           {user?.lastOnlineAt&&           
  <Text style={[styles.userName, { color: isDarkMode ? '#fff' : '#000', fontSize: 11 }]}>
    {getUserStatus(user?.lastOnlineAt)}
  </Text>}
          </View>
        </TouchableOpacity>
{/*
        <View style={styles.iconsContainer}>
          <Feather 
            name="camera" 
            size={24} 
            color={isDarkMode ? '#fff' : '#333'} 
            style={styles.icon} 
            onPress={takePhoto}
          />
          <Entypo 
            name="dots-three-vertical" 
            size={20} 
            color={isDarkMode ? '#fff' : '#333'} 
            style={styles.icon} 
          />
        </View>*/}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: -30,
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
    marginLeft: 0,
    gap:20
  },
  icon: {
    marginHorizontal: 0,
  },
});

export default ChatRoomHeader;
