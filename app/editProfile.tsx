import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={{ uri: 'https://thumbs.dreamstime.com/b/young-businessman-standing-black-background-handsome-man-suit-tie-fashion-portrait-71560442.jpg' }} // Replace with your image URL
          style={styles.profilePicture}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Text style={styles.editIconText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Name Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} value="bunny 🫰🫰" editable={true} />
          <TouchableOpacity>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>
          This is not your username or PIN. This name will be visible to your WhatsApp contacts.
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.label}>About</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value="Take me back to the day we met"
            editable={false}
          />
          <TouchableOpacity>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Phone Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Phone</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value="+91 91XXXXXX"
            editable={false}
          />
          <TouchableOpacity>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#4caf50',
    borderRadius: 20,
    padding: 5,
  },
  editIconText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  editButton: {
    fontSize: 16,
    color: '#4caf50',
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
