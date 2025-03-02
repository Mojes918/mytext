
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  SectionList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
  useColorScheme,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { API, Auth } from 'aws-amplify';
import { getUser, listUsers } from '@/src/graphql/queries';
import UserItem from '@/components/UserItem/UserItem'; // Ensure UserItem is adjusted for registered users
import AsyncStorage from '@react-native-async-storage/async-storage';

const normalizePhoneNumber = (number) => {
  if (!number) return '';
  const digits = number.replace(/[^0-9]/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};


const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'; // Default image for unregistered users

const ContactSearchScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const inputBackgroundColor = isDarkMode ? '#1e1e1e' : '#f5f5f5';
  const inputBorderColor = isDarkMode ? '#3c3c3c' : 'gray';

  useEffect(() => {
    loadCachedContacts(); // Load cached contacts first
    fetchContactsAndUsers(); // Then fetch new data
  }, []);

  const loadCachedContacts = async () => {
    
    try {
      const cachedData = await AsyncStorage.getItem('cached_contacts');
      if (cachedData) {
        setContacts(JSON.parse(cachedData));
        setFilteredContacts(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error('Error loading cached contacts:', error);
    }
  };


  const fetchContactsAndUsers = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const currentUserId = authUser?.attributes?.sub;
  
      let currentUserPhoneNumber;
  
      // Try to load cached user data first
      const cachedUser = await AsyncStorage.getItem('cached_user');
      if (cachedUser) {
        const parsedUser = JSON.parse(cachedUser);
        currentUserPhoneNumber = normalizePhoneNumber(parsedUser.phonenumber);
      }
  
      // Fetch user data only if it's not cached
      if (!currentUserPhoneNumber) {
        try {
          const userResponse = await API.graphql({
            query: getUser,
            variables: { id: currentUserId },
          });
  
          const fetchedUser = userResponse.data.getUser;
          if (fetchedUser?.phonenumber) {
            currentUserPhoneNumber = normalizePhoneNumber(fetchedUser.phonenumber);
            await AsyncStorage.setItem('cached_user', JSON.stringify(fetchedUser)); // Cache the user data
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      }
  
      if (!currentUserPhoneNumber) {
        console.error("User phone number missing, using empty value.");
        return;
      }
  
      // Fetch all users from the database
      const userResponse = await API.graphql({ query: listUsers });
      const dbUsers = userResponse.data.listUsers.items||[];
  
      // Filter out current user from the user list
      const dbUsersByPhone = new Map(
        dbUsers
          .filter(user => normalizePhoneNumber(user.phonenumber) !== currentUserPhoneNumber) // Exclude current user
          .map(user => [normalizePhoneNumber(user.phonenumber), user])
      );
  
      // Fetch phone contacts
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access contacts was denied.');
        setLoading(false);
        return;
      }
  
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
  
      const validContacts = data.filter(
        (contact) =>
          contact.phoneNumbers &&
          contact.phoneNumbers.length > 0 &&
          normalizePhoneNumber(contact.phoneNumbers[0].number)
      );
  
      const registered = [];
      const unregistered = [];
      const seenPhoneNumbers = new Set();
  
      validContacts.forEach((contact) => {
        const phoneNumber = normalizePhoneNumber(contact.phoneNumbers[0]?.number);
        if (phoneNumber && !seenPhoneNumbers.has(phoneNumber)) {
          seenPhoneNumbers.add(phoneNumber);
  
          if (dbUsersByPhone.has(phoneNumber)) {
            const user = dbUsersByPhone.get(phoneNumber);
            registered.push({
              ...contact,
              ...user,
              isRegistered: true,
            });
          } else {
            unregistered.push({
              ...contact,
              isRegistered: false,
              imageUri: defaultImage,
            });
          }
        }
      });
  
      registered.sort((a, b) => a.name.localeCompare(b.name));
      unregistered.sort((a, b) => a.name.localeCompare(b.name));
  
      const finalContacts = [
        { title: 'Contact', data: registered },
        { title: 'Invite', data: unregistered },
      ];
  
      setContacts(finalContacts);
      setFilteredContacts(finalContacts);
  
      try {
        await AsyncStorage.setItem('cached_contacts', JSON.stringify(finalContacts));
      } catch (error) {
        console.error("Failed to cache contacts:", error);
      }
      
    } catch (err) {
      //console.error('Error fetching contacts or users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.map((section) => ({
      title: section.title,
      data: section.data.filter(
        (item) =>
          (item.name?.toLowerCase().includes(query.toLowerCase())) || 
          normalizePhoneNumber(item.phoneNumbers[0]?.number).includes(query.replace(/\D/g, ''))
      ),
    }));

    const noResultsFound = filtered.every((section) => section.data.length === 0);

    if (noResultsFound) {
      setFilteredContacts([{ title: 'No results', data: [{ name: 'No user found for this query' }] }]);
    } else {
      setFilteredContacts(filtered);
    }
  };

  const sendInviteSMS = (phoneNumber) => {
    const inviteMessage = `Hello! Join us on MyText. Download the app and connect with me.`;
    const phoneUrl = `sms:${phoneNumber}?body=${encodeURIComponent(inviteMessage)}`;

    Linking.openURL(phoneUrl).catch((err) => console.error('Failed to send SMS', err));
  };

  
  

  
  const renderItem = ({ item }) => {
    if (item.name === 'No user found for this number') {
      return (
        <View style={[styles.contactItem, { backgroundColor }]}>
          <Text style={[styles.contactName, { color: textColor }]}>{item.name}</Text>
        </View>
      );
    }
    //console.log(item);
    if (item.isRegistered) {
      return <UserItem user={item} isRegistered onPress={() => console.log(`Open chatroom with: ${item.name}`)} />;
    }

    return (
      <View style={[styles.contactItem, { backgroundColor }]}>
        <Image source={{ uri: item.imageUri || defaultImage }} style={styles.contactImage} />
        <Text style={[styles.contactName, { color: textColor }]}>
  {item.name || item.phoneNumbers?.[0]?.number || 'Unknown'}
</Text>

        <TouchableOpacity style={styles.inviteButton} onPress={() => sendInviteSMS(item.phoneNumbers[0]?.number)}>
          <Text style={[styles.inviteText, { color: "#007bff" }]}>Invite</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const filteredSections = filteredContacts.filter(
    (section) => section.title === 'Contact' || (section.title === 'Invite' && section.data.length > 0)
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextInput
  style={[
    styles.searchBar,
    { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: textColor }, // Text color added here
  ]}
  placeholder="Search contacts..."
  placeholderTextColor={isDarkMode ? '#bbb' : '#555'}

  value={searchQuery}
  onChangeText={handleSearch}
  keyboardType="phone-pad"
/>

<SectionList
  sections={filteredSections}
  keyExtractor={(item, index) => item?.id ? item.id : `contact-${index}`}
  renderItem={renderItem}
  renderSectionHeader={renderSectionHeader}
  ListEmptyComponent={
    searchQuery ? (
      <Text style={[styles.emptyText, { color: textColor }]}>No results found</Text>
    ) : (
      <Text style={[styles.emptyText, { color: textColor }]}>Start searching for contacts</Text>
    )
  }
/>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  sectionHeader: {
    padding: 5,
    //borderBottomWidth: 1,
    //borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
    flex: 1,
  },
  inviteButton: {
    padding: 10,
    //backgroundColor: '#007bff',
    borderRadius: 8,
  },
  inviteText: {
    fontSize: 14,
    color: '#007bff',
  },
});

export default ContactSearchScreen;
