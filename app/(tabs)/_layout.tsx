import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


import {withAuthenticator}from "aws-amplify-react-native";
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from '../../src/aws-exports'; // Adjust the path if necessary

try {
  Amplify.configure(awsconfig);

} catch (error) {
  console.error("Amplify configuration failed:", error);
}


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


function TabLayout() {
  const colorScheme = useColorScheme();


  useEffect(()=>{
    async function getAuthenticatedUser() {
      try {
          const user = await Auth.currentAuthenticatedUser();
         // Contains details like email, sub, etc.
      } catch (error) {
          console.error('Error fetching authenticated user:', error);
      }
  }
  getAuthenticatedUser();
  },[])
  
  
console.log("Hey Hello")

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title:'Chats',
          headerShown:false,
          tabBarIcon: ({ color }) =><AntDesign name="message1" size={26} color={color} />,
         
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Stories',
          headerShown:false,
          tabBarIcon: ({ color }) => <MaterialIcons name="web-stories" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'profile',
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={26} color={color} />,
        }}
        />
    </Tabs>
  );
}
export default withAuthenticator(TabLayout);
