import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';



/*import {withAuthenticator} from 'aws-amplify-react-native';


import { Amplify } from 'aws-amplify';
import config from '../aws-exports'

Amplify.configure(config);
*/







// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

 function TabLayout() {
  const colorScheme = useColorScheme();

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
          tabBarIcon: ({ color }) =><AntDesign name="message1" size={24} color={color} />,
         
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Social',
          headerShown:false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="circle-multiple-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default (TabLayout);