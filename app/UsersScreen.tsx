import { FlatList, TextInput, Text, View, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import UserItem from '@/components/UserItem/UserItem';
import { API } from 'aws-amplify';
import { listUsers } from '../src/graphql/queries';

function UsersScreen() {
  const [users, setUsers] = useState([]);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Dynamic color variables
  const backgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const inputBackgroundColor = isDarkMode ? '#1e1e1e' : '#f5f5f5';
  const inputBorderColor = isDarkMode ? '#3c3c3c' : 'gray';

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const fetchUser = await API.graphql({
        query: listUsers,
      });
      const fetchedUsers = fetchUser.data.listUsers.items;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  return (
    <View style={{ backgroundColor, flex: 1 }}>
      <TextInput
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderColor: inputBorderColor,
          borderWidth: 1,
          alignSelf: 'center',
          marginVertical: 10,
          backgroundColor: inputBackgroundColor,
          color: textColor,
          paddingHorizontal: 10,
        }}
        placeholder="Search Contacts"
        placeholderTextColor={isDarkMode ? '#888888' : 'gray'}
        // value={searchQuery}
        // onChangeText={setSearchQuery}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem user={item} />}
        ListHeaderComponent={() => (
          <Text style={{ paddingHorizontal: 15, color: textColor }}>Chat Users</Text>
        )}
      />
    </View>
  );
}

export default UsersScreen;



