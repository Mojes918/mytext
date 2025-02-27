import React from 'react'; 
import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons} from '@expo/vector-icons';
import { withAuthenticator } from "aws-amplify-react-native";
import { Amplify, API, Auth } from 'aws-amplify';
import Colors from '@/constants/Colors';
import awsconfig from '../../src/aws-exports';
import * as mutations from '../../src/graphql/mutations';
import { getUser } from '@/src/graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
Amplify.configure(awsconfig);

interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
  lastOnlineAt: number | null;
}

const CACHE_KEY = 'cachedUser';
const TabLayout = () => {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        retryLastOnlineUpdate();
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  const retryLastOnlineUpdate = async () => {
    const storedTimestamp = await AsyncStorage.getItem('lastOnlineAt');
    if (storedTimestamp) {
      await updateLastOnline(); // Retry the API call
      await AsyncStorage.removeItem('lastOnlineAt'); // Remove stored timestamp after success
    }
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Step 1: Load cached user first
        const cachedUser = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        // Step 2: Fetch user from API
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const result = await API.graphql({
          query: getUser,
          variables: { id: authenticatedUser.attributes.sub },
        });

        const fetchedUser = result.data.getUser;
        setUser(fetchedUser);

        // Step 3: Cache the fetched user data
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fetchedUser));

      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        updateLastOnline();
      }
    }, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, [user]);

  const updateLastOnline = async () => {
    if (!user) return;
  
    const newLastOnline = Math.floor(Date.now() / 1000);
  
    try {
      await API.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: user.id,
            lastOnlineAt: newLastOnline,
          },
        },
      });
  
      // Update cached user only if API call succeeds
      const updatedUser = { ...user, lastOnlineAt: newLastOnline };
      setUser(updatedUser);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedUser));
  
    } catch (error) {
      // Store lastOnlineAt locally for retry
      await AsyncStorage.setItem('lastOnlineAt', newLastOnline.toString());
    }
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Active tab color
        tabBarInactiveTintColor: '#888', // Inactive tab color
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#0d0d0c' : '#fff', // Dark/light mode support #171716
          borderTopWidth: 0, // Remove top border
          elevation: 5, // Shadow effect (Android)
          shadowOpacity: 0.1, // Soft shadow (iOS)
          height: 60, // Increased height for better visibility
          paddingTop: 5, // Adjust bottom padding for centering
        },
        tabBarLabelStyle: {
          fontSize: 12, // Slightly larger font
          fontWeight: 'bold', // Make it stand out
        },
        tabBarItemStyle: {
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
        },
        headerShown: false, // Hide header
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goonline"
        options={{
          title: 'Online',
          tabBarIcon: ({ color }) => <MaterialIcons name="chat" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user-large" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
  

}
export default withAuthenticator(TabLayout);  