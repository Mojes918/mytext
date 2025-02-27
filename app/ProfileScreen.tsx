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
  ActivityIndicator,
} from 'react-native';
import { API } from 'aws-amplify';
import { getUser } from '@/src/graphql/queries'; // Assuming this query fetches user details
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';
import { GET_USER } from '@/src/graphql/operations';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Default image
const defaultImage = require("../assets/images/default.jpg");

// Profile Screen Component
export default function ProfileScreen() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
   const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const router=useRouter();
    const textColor = isDarkMode ? 'white' : 'black';
    const selectColor = isDarkMode ? '#3d3d3d' : '#ddd';
    const backgroundColor = isDarkMode ? '#121212' : '#fff'
    const textbackgroundColor=isDarkMode?"#222":"#fff";
  const route = useRoute();
    const { id } = route.params || {};


  
  // Fetch user data using Apollo useQuery
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id },
    skip: !id, 
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#256ffa" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red' }}>Error loading profile</Text>
      </View>
    );
  }

  const user = data?.getUser;
  
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
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={{flexDirection:"row",alignItems:"center"}}>
  <Ionicons name="arrow-back-outline" size={30} color="black" style={styles.backButton}/>
  <Text style={styles.backButton}>Back</Text>
  </TouchableOpacity>
</View>

      <Image
                source={{
                  uri:
                    user?.backgroundImageUri ||user?.imageUri||
                    "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                }}
              style={{height:200,width:"100%",position:"relative"}}
              />
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
      <View style={[styles.section,{}]}>
      <Text style={[styles.sectionTitle,{color:textColor}]}>About</Text>
        <Text style={[styles.sectionContent,{color:textColor}]}>{user?.status || 'No details available'}</Text>
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
    //padding: 20,
    //alignItems: 'center',
    flex:1
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 75,
    borderWidth:2,
    borderColor:"white",
    //marginBottom: 20,
    position:"absolute",
    top:-60,
    left:10
  },
  header: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10, // Ensures it stays above the image
    backgroundColor: "rgba(0,0,0,0.5)", // Optional for visibility
    padding: 8,
    borderRadius: 5,
  },
  
  backButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:60,
    marginLeft:20
  },
  email: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
    marginLeft:20
  },
  section: {
    marginBottom: 20,
    width: '100%',
    shadowColor:"black",
    marginLeft:20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
    paddingRight:20
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
