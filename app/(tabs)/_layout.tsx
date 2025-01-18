import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { withAuthenticator } from "aws-amplify-react-native";
import { Amplify, API, Auth } from 'aws-amplify';
import Colors from '@/constants/Colors';
import awsconfig from '../../src/aws-exports';
import * as mutations from '../../src/graphql/mutations';
import { getUser } from '@/src/graphql/queries';

Amplify.configure(awsconfig);

interface User {
  id: string;
  name: string;
  imageUri?: string;
  status?: string;
  lastOnlineAt: number | null;
}

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const result = await API.graphql({
          query: getUser,
          variables: { id: authenticatedUser.attributes.sub },
        });
        const fetchedUser = result.data.getUser;
        setUser(fetchedUser);
        //console.log("Fetched user:", fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    
      const interval = setInterval(() => {
        if(user){
        updateLastOnline();
        }
      }, 60000); // Update every 1 minute

      return () => clearInterval(interval);
    
  }, [user]);

  const updateLastOnline = async () => {
    if (!user) return;

    try {
      await API.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: user.id,
            lastOnlineAt: Math.floor(Date.now() / 1000),
          },
        },
      });
    } catch (error) {
      console.error('Error updating lastOnlineAt:', error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <AntDesign name="message1" size={26} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="Social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => <MaterialIcons name="web-stories" size={26} color={color} />,
        }}
      />

<Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default withAuthenticator(TabLayout);
