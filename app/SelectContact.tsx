import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { API, Auth } from 'aws-amplify';
import { chatRoomUsersByUserId, listChatRooms, listUsers } from '@/src/graphql/queries';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { createChatRoom, createMessage } from '@/src/graphql/mutations';
import { listChatRoomUsersWithDetails } from '@/src/CustomQuery';

const normalizePhoneNumber = (number) => {
  if (!number) return '';
  return number.replace(/[^0-9]/g, '').slice(-10); // Keep only the last 10 digits
};

const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'; // Default image for unregistered users

const SelectContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const inputBackgroundColor = isDarkMode ? '#1e1e1e' : '#f5f5f5';
  const inputBorderColor = isDarkMode ? '#3c3c3c' : 'gray';

  const router = useRouter();
  const route = useRoute();
  const { message, scheduledTime } = route.params || {}; // Access params for query

  const toggleSelectContact = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  useEffect(() => {
    fetchContactsAndUsers();
  }, []);

  const fetchContactsAndUsers = async () => {
    try {
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

      const userResponse = await API.graphql({ query: listUsers });
      const dbUsers = userResponse.data.listUsers.items;

      const dbUsersByPhone = new Map(
        dbUsers.map((user) => [normalizePhoneNumber(user.phonenumber), user])
      );

      const registered = [];
      const seenPhoneNumbers = new Set(); // Track already processed phone numbers to avoid duplicates

      validContacts.forEach((contact) => {
        const phoneNumber = normalizePhoneNumber(contact.phoneNumbers[0]?.number);
        if (phoneNumber && !seenPhoneNumbers.has(phoneNumber)) {
          seenPhoneNumbers.add(phoneNumber); // Mark this phone number as processed

          if (dbUsersByPhone.has(phoneNumber)) {
            const user = dbUsersByPhone.get(phoneNumber);
            registered.push({
              ...contact,
              ...user,
              isRegistered: true,
            });
          }
        }
      });

      // Sort registered contacts by name
      registered.sort((a, b) => a.name.localeCompare(b.name));

      setContacts(registered);
      setFilteredContacts(registered);
    } catch (err) {
      console.error('Error fetching contacts or users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredContacts(contacts); // Reset to all contacts when query is empty
      return;
    }

    const filtered = contacts.filter(
      (item) =>
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        normalizePhoneNumber(item.phoneNumbers[0]?.number).includes(query.replace(/\D/g, ''))
    );

    setFilteredContacts(filtered);
  };



  const findChatroomAndSendMessage = async (selectedUserPhoneNumber, messageContent, scheduledTime) => {
    try {
      // Get the current authenticated user ID
      const authUser = await Auth.currentAuthenticatedUser();
      const authUserID = authUser.attributes.sub; // Authenticated user's ID
  
      // Normalize phone number
      const phoneNumber = normalizePhoneNumber(selectedUserPhoneNumber);
  
      // Query for users based on the phone number (for selected user)
      const userResponse = await API.graphql({
        query: listUsers,
        variables: { filter: { phonenumber: { eq: phoneNumber } } },
      });
  
      const selectedUser = userResponse.data.listUsers.items[0];
      if (!selectedUser) {
        console.error('User not found');
        return;
      }
      const selectedUserID = selectedUser.id;
  
      // Query chatroom users for the authenticated user
      const authUserChatroomsResponse = await API.graphql({
        query: listChatRoomUsersWithDetails,
        variables: { filter: { userId: { eq: authUserID } } },
      });
      const authUserChatrooms = authUserChatroomsResponse.data.listChatRoomUsers.items;
  
      // Query chatroom users for the selected user
      const selectedUserChatroomsResponse = await API.graphql({
        query: listChatRoomUsersWithDetails,
        variables: { filter: { userId: { eq: selectedUserID } } },
      });
      const selectedUserChatrooms = selectedUserChatroomsResponse.data.listChatRoomUsers.items;
  
      // Find matching chatroom IDs between both users
      let matchingChatroomID = null;
      for (let authUserChatroom of authUserChatrooms) {
        for (let selectedUserChatroom of selectedUserChatrooms) {
          if (authUserChatroom.chatRoomId === selectedUserChatroom.chatRoomId) {
            matchingChatroomID = authUserChatroom.chatRoomId; // Found the matching chatroom
            break;
          }
        }
        if (matchingChatroomID) break; // Exit loop once we find a match
      }
  
      // If no matching chatroom is found, create a new one
      if (!matchingChatroomID) {
        console.log('No existing chatroom found, creating a new one...');
        const newChatRoom = {
          ChatRoomUsers: [authUserID, selectedUserID],
          newMessages: 0, // Initial value for new messages count
        };
        const createChatRoomResponse = await API.graphql({
          query: createChatRoom, // Assuming you have a createChatRoom mutation
          variables: { input: newChatRoom },
        });
        matchingChatroomID = createChatRoomResponse.data.createChatRoom.id;
      }
  
      // Ensure scheduledTime is valid and convert it to AWSTimestamp
      const scheduledTimestamp = new Date(scheduledTime).getTime(); // Convert date to timestamp (milliseconds)
  console.log(scheduledTimestamp);
      // Create the message with scheduled time and status 'SENT'
      const message = {
        content: messageContent,
        userID: authUserID,
        chatroomID: matchingChatroomID,
        status: 'SENT',
        scheduledTime: scheduledTimestamp, // Set scheduled time
        isScheduled: true, // Flag indicating it's a scheduled message
      };
  
      const sendMessageResponse = await API.graphql({
        query: createMessage,
        variables: { input: message },
      });
  
      console.log('Message scheduled successfully:', sendMessageResponse);
    } catch (error) {
      console.error('Error scheduling message:', error);
    }
  };
  


  // Define a function that sends a message to all selected contacts
  const sendSelectedContacts = async () => {
    if (selectedContacts.length === 0) {
      alert('No contacts selected');
      return;
    }

    try {
      // Loop through selected contacts and send message to each one
      for (let contactId of selectedContacts) {
        const selectedContact = contacts.find((contact) => contact.phoneNumbers[0]?.number === contactId);
        if (!selectedContact) {
          console.error('Selected contact not found');
          continue;
        }

        const phoneNumber = selectedContact.phoneNumbers[0]?.number;
        console.log("phonenumber",phoneNumber);
        console.log("message",message);
        console.log("time",scheduledTime);
        const messageContent = message || 'Hello!'; // Default message if none provided
        await findChatroomAndSendMessage(phoneNumber, messageContent,scheduledTime); // Call the function to send message

        console.log('Message sent to:', selectedContact.name);
      }

      // After sending the message, you can navigate back or clear selections
      alert('Messages sent!');
      setSelectedContacts([]); // Clear the selected contacts after sending
      router.push({
        pathname: '/SuccessScreen',
        params: { message: message, scheduledTime: scheduledTime } // Pass params with Expo Router
      });// Optionally navigate back to the previous screen
    } catch (error) {
      console.error('Error sending messages:', error);
      alert('Failed to send messages');
    }
  };

  // Render selected contact item
  const renderContact = ({ item }) => {
    const isSelected = selectedContacts.includes(item.phoneNumbers[0]?.number);

    return (
      <TouchableOpacity
        style={[styles.contactContainer, isSelected && { backgroundColor: '#3777f0' }]}
        onPress={() => toggleSelectContact(item.phoneNumbers[0]?.number)} // Use phone number as unique ID
      >
        <View style={styles.contactDetails}>
          <Image
            style={styles.avatar}
            source={{
              uri: item.imageUri || 'https://via.placeholder.com/50', // Placeholder if no image
            }}
          />
          <View>
            <Text style={[styles.contactName, { color: textColor }]}>{item.name}</Text>
            <Text style={[styles.contactPhone, { color: textColor }]}>{item.phoneNumbers[0]?.number}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
        placeholder="Search contacts..."
        placeholderTextColor={isDarkMode ? '#ddd' : '#555'}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.phoneNumbers[0]?.number}
          renderItem={renderContact}
          extraData={selectedContacts}
        />
      )}

      {selectedContacts.length > 0 && (
        <FAB
          style={styles.fab}
          icon="send"
          label={`Send (${selectedContacts.length})`}
          onPress={sendSelectedContacts} // Call the function when FAB is pressed
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  contactContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3777f0',
  },
});

export default SelectContactScreen;
