import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API } from 'aws-amplify';
import { getUser } from '@/src/graphql/queries'; // Assuming this query fetches user details
import { Route, useRoute } from '@react-navigation/native';
// Default image
const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

// Profile Screen Component
export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
   const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    
    const textColor = isDarkMode ? 'white' : 'black';
    const selectColor = isDarkMode ? '#3d3d3d' : '#ddd';
    const backgroundColor = isDarkMode ? '#121212' : '#fff'
    const textbackgroundColor=isDarkMode?"#222":"#fff";
  const route = useRoute();
    const { id } = route.params || {};

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await API.graphql({
          query: getUser,
          variables: { id },
        });
        console.log("response",response);
        setUser(response?.data?.getUser || null);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [id]);

  const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:backgroundColor}]}>
      {/* Profile Image */}
      <TouchableOpacity onPress={() => openModal(user?.imageUri || '')}>
        <Image
          source={{ uri: user?.imageUri || defaultImage }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      
      {/* User Info */}
      <Text style={[styles.name,{color:textColor}]}>{user?.name}</Text>
      <Text style={[styles.email,{color:textColor}]}>{user?.phonenumber}</Text>

      {/* About Section */}
      <View style={[styles.section,{backgroundColor:textbackgroundColor}]}>
      <Text style={[styles.sectionTitle,{color:textColor}]}>About</Text>
        <Text style={[styles.sectionContent,{color:textColor}]}>{user?.status || 'No details available'}</Text>
      </View>

      {/* Bio Section */}
      <View style={[styles.section,{backgroundColor:textbackgroundColor}]}>
        <Text style={[styles.sectionTitle,{color:textColor}]}>Bio</Text>
        <Text style={[styles.sectionContent,{color:textColor}]}>{user?.bio || 'No bio available'}</Text>
      </View>

      {/* Modal for image preview */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage || defaultImage }}
                style={styles.fullscreenImage}
                resizeMode="cover"
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flex:1
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%',
    shadowColor:"black",
    padding:20
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  loader: {
    padding: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: 250,
    height: 300,
    borderRadius: 10,
  },
});
