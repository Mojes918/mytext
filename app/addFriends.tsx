import UserItem from '@/components/UserItem/UserItem';
import { listUsers } from '@/src/graphql/queries';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  useColorScheme
} from 'react-native';

export default function AddFriends() {
  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();
  const [users, setUsers] = useState([]);
  // Define light theme colors
  
    const isDarkMode = colorScheme === 'dark';
  
    // Dynamic color variables
    const backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    const textColor = isDarkMode ? '#ffffff' : '#000000';
    const inputBackgroundColor = isDarkMode ? '#1e1e1e' : '#f5f5f5';
    const inputBorderColor = isDarkMode ? '#3c3c3c' : 'gray';
  
  const lightTheme = {
    background: '#ffffff',
    text: '#000000',
    subtitleText: '#777777',
    border: '#ddd',
    primary: '#3777f0',
    secondary: '#4caf50',
    blockedText: '#f44336',
    inputBackground: '#ffffff',
    searchBarBackground: '#f5f5f5',
    actionBackground: '#ffffff',
  };

  // Define dark theme colors
  const darkTheme = {
    background: '#121212',
    text: '#ffffff',
    subtitleText: '#b0b0b0',
    border: '#444',
    primary: '#1E88E5',
    secondary: '#66BB6A',
    blockedText: '#FF5252',
    inputBackground: '#333',
    searchBarBackground: '#111',
    actionBackground: '#111',
  };

  // Select theme based on the system color scheme
  const currentTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  
  
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
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: currentTheme.searchBarBackground }]}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={currentTheme.text}
          style={[styles.searchInput, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text }]}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionItem, { backgroundColor: currentTheme.actionBackground }]}>
          <Text style={[styles.actionIcon, { color: currentTheme.secondary }]}>👥</Text>
          <Text style={[styles.actionText, { color: currentTheme.text }]}>New group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionItem, { backgroundColor: currentTheme.actionBackground }]}>
          <Text style={[styles.actionIcon, { color: currentTheme.secondary }]}>➕</Text>
          <Text style={[styles.actionText, { color: currentTheme.text }]}>New contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionItem, { backgroundColor: currentTheme.actionBackground }]}>
          <Text style={[styles.actionIcon, { color: currentTheme.secondary }]}>🌐</Text>
          <Text style={[styles.actionText, { color: currentTheme.text }]}>New community</Text>
        </TouchableOpacity>
      </View>
       <FlatList
              data={users}
              renderItem={({ item }) => <UserItem user={item} />}
              ListHeaderComponent={() => (
                <Text style={{ paddingHorizontal: 15, color: textColor }}>Chat Users</Text>
              )}
            />
            <Text>Contacts</Text>
      {/* Contact List */}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    padding: 10,
  },
  searchInput: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  actionButtons: {
    padding: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    padding: 10,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
  },
  contactList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
  },
  contactSubtitle: {
    fontSize: 14,
  },
});
