import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Avatar } from 'react-native-paper';

const statusUpdates = [
  { id: '1', name: 'Sudheer', time: '41 minutes ago', imageUrl: require('../assets/images/images1.jpg') },
  { id: '2', name: 'Bsp', time: '3 minutes ago', imageUrl: require('../assets/images/images2.jpg') },
  { id: '3', name: 'Prasanth', time: 'Yesterday', imageUrl: require('../assets/images/images3.jpg') },
  { id: '4', name: 'David E', time: 'Yesterday', imageUrl: require('../assets/images/images4.jpg') },
  { id: '5', name: 'Ajith Varma', time: 'Yesterday', imageUrl: require('../assets/images/images5.jpg') },
  { id: '6', name: 'Raj', time: 'Yesterday', imageUrl: require('../assets/images/images10.jpg') },
  { id: '7', name: 'Kumar', time: 'Yesterday', imageUrl: require('../assets/images/images7.jpg') },
  { id: '8', name: 'Sis', time: 'Yesterday', imageUrl: require('../assets/images/images8.jpg') },
];

const Stories = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.statusItem}>
      <View style={[styles.statusBorder, { borderColor: '#555' }]}>
        <Avatar.Image size={50} source={item.imageUrl} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: isDarkMode ? '#ffffff' : '#000000' }]}>{item.name}</Text>
        <Text style={[styles.time, { color: isDarkMode ? '#aaaaaa' : '#666666' }]}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      {/* My Status */}
      <View style={styles.myStatus}>
        <Avatar.Icon size={50} icon="plus" style={[styles.myAvatar, { backgroundColor: '#3777f0' }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: isDarkMode ? '#ffffff' : '#000000' }]}>My status</Text>
          <Text style={[styles.time, { color: isDarkMode ? '#aaaaaa' : '#666666' }]}>Tap to add status update</Text>
        </View>
      </View>

      {/* Recent Updates */}
      <Text style={[styles.header, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Recent updates</Text>
      <FlatList
        data={statusUpdates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  myStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  myAvatar: {
    backgroundColor: '#3777f0',
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
  },
  header: {
    fontSize: 14,
    marginVertical: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  statusBorder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Stories;
