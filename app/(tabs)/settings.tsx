import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput, useColorScheme, TouchableWithoutFeedback } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useQuery, useMutation } from "@apollo/client";  // Import Apollo Client hooks
import { useRouter } from "expo-router";
import awsconfig from "../../src/aws-exports";
import { styles } from "../styles/profilestyles";
import { Auth, Storage } from "aws-amplify";
import { useApolloClient } from "@apollo/client";  // Import useApolloClient
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import{GET_USER,UPDATE_USER} from "../../src/graphql/operations"

// Define color themes
const colorScheme = {
  dark: {
    background: "#121212",
    textPrimary: "#FFFFFF",
  },
  light: {
    background: "#FFFFFF",
    textPrimary: "#121212",
  },
};

type User = {
  id: string;
  name: string;
  phonenumber: string;
  status: string;
  imageUri?: string;
  backgroundImageUri?: string;
};

export default function Settings() {
  const currentTheme = useColorScheme() || "dark";
  const theme = colorScheme[currentTheme];
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [modalImage, setModalImage] = useState<string | null>(null); // State to hold image to show in modal

  const [userId, setUserId] = useState<string | null>(null);




  const handleImagePress = (imageUri: string | null) => {
    setModalImage(imageUri); // Set the image to be displayed in the modal
    setModalVisible(true); // Open the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
    setModalImage(null); // Clear the modal image
  };
//console.log(userId)

// Inside your component
const client = useApolloClient();  // Get the Apollo Client instance
  // UseEffect to fetch the userId from the authenticated user
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserId(user.attributes.sub); // Store the authenticated user's ID
      } catch (error) {
        console.error("Error fetching user ID: ", error);
      }
    };
    
    fetchUserId();
  }, []); // Runs once when the component mounts

  // Fetch user data using Apollo's useQuery hook, passing the userId once available
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId, // Skip the query until the userId is available
    fetchPolicy:'cache-first'
  });
  useEffect(() => {
    if (data?.getUser) {
      setProfileImage(data.getUser.imageUri || null);
      setBackgroundImage(data.getUser.backgroundImageUri || null);
    }
  }, [data]);
  
  const [updateUserMutation] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const updatedUser = data.updateUser;
      // After updating the user, update the Apollo cache
      client.cache.writeQuery({
        query: GET_USER,
        variables: { id: updatedUser.id },
        data: { getUser: updatedUser }, // Write the updated user to Apollo cache
      });
    },
    onError: (error) => {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Unable to update user data.");
    },
  });
  

  const updateUserData = async (updatedUser: User) => {
    try {
      // Make the GraphQL mutation to update the user data
      await updateUserMutation({
        variables: { input: updatedUser },
      });
      // Update local state as well
      setProfileImage(updatedUser.imageUri || null);
      setBackgroundImage(updatedUser.backgroundImageUri || null);
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Unable to update user data.");
    }
  };

  const pickImage = async (type: "profile" | "background") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      try {
        setIsLoading(true);
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
  
        const fileExtension = selectedImageUri.split(".").pop() || "jpg";
        const key = `${type}-image-${Date.now()}.${fileExtension}`;
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;
  
        // Get the old user data to preserve other fields
        const { data } = await client.query({
          query: GET_USER,
          variables: { id: userId },
          fetchPolicy: "network-only", // Ensure fresh data from the server
        });
  
        const oldImageUrl = type === "profile" ? data?.getUser?.imageUri : data?.getUser?.backgroundImageUri;
  
        // Extract the key from the old image URL (if exists)
        if (oldImageUrl) {
          const keyToDelete = oldImageUrl.split("/").pop(); // Extracts "filename.jpg"
          if (keyToDelete) {
            await Storage.remove(keyToDelete, { level: "public" });
            console.log(`Deleted old ${type} image: ${keyToDelete}`);
          }
        }
  
        // Upload the new image
        const uploadResult = await Storage.put(key, blob, {
          contentType: blob.type,
          level: "public",
        });
  
        const publicUrl = `https://${awsconfig.aws_user_files_s3_bucket}.s3.${awsconfig.aws_user_files_s3_bucket_region}.amazonaws.com/public/${uploadResult.key}`;
  
        // Ensure other values remain unchanged
        const updatedUser = {
          id: userId,
          imageUri: type === "profile" ? publicUrl : data?.getUser?.imageUri, // Keep existing profile image
          backgroundImageUri: type === "background" ? publicUrl : data?.getUser?.backgroundImageUri, // Keep existing background
        };
  
        // Update the user data
        await updateUserData(updatedUser);
  
        // Update only the selected image in the state
        if (type === "profile") {
          setProfileImage(publicUrl);
        } else {
          setBackgroundImage(publicUrl);
        }
  
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert("Error", "Unable to upload image.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const LogOut = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const userId = userData.attributes.sub;
  
      await Auth.signOut();
      // Remove specific user cache from Apollo
      client.cache.evict({ fieldName: 'getUser' });
      client.cache.gc(); // Garbage collect to remove unused cache
      // Reset state
      setProfileImage(null);
      setBackgroundImage(null);
    } catch (error) {
      Alert.alert("Error", "Unable to log out. Please try again.");
    }
  };

  // Loading state while fetching user data
  if (loading) return <ActivityIndicator size="large" color={theme.textPrimary} />;
  if (error) return <Text>Error: {error.message}</Text>;
const defaultImage=require("../../assets/images/default.jpg");
const defaultSource=require("../../assets/images/default-background.avif")
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
      <Image source={backgroundImage||profileImage ? { uri: backgroundImage || profileImage} : defaultSource} style={styles.backgroundImage} />

        <TouchableOpacity style={styles.cameraIconBackground} onPress={() => pickImage("background")}>
        <Ionicons name="camera-outline" size={24} color="white" />
        </TouchableOpacity>

        
        
        <Image source={profileImage ? { uri: profileImage } : defaultImage} style={styles.profileImage} />

        

        <TouchableOpacity style={[styles.cameraIconProfile]} onPress={() => pickImage("profile")}>
        <Ionicons name="camera-outline" size={24} color="white" />
        
        </TouchableOpacity>
        

        <Text style={[styles.profileName, { color: theme.textPrimary }]}>{data?.getUser?.name || "User Name"}</Text>
        <Text style={[styles.profileNumber, { color: theme.textPrimary }]}>{data?.getUser?.phonenumber || "+1234567890"}</Text>
      </View>

      {/* About Section */}
      <View style={styles.aboutContainer}>
        <TextInput
          style={[styles.aboutInput, { color: theme.textPrimary }]}
          placeholder="Add a brief description about yourself"
          placeholderTextColor={theme.textPrimary}
          multiline={true}
          value={data?.getUser?.status || ""}
          editable={false}
        />
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => router.push({pathname:"/EditProfile",params:{
        name:data?.getUser?.name,
        phone:data?.getUser?.phonenumber,
        about:data?.getUser?.status

      }})}>
        <Text style={[styles.editButtonText, { color: theme.textPrimary }]}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Log Out Button */}
      <View style={styles.logoutContainer}>
      <TouchableOpacity style={styles.logoutButton} onPress={LogOut}>
        <Text style={[styles.logoutButtonText, { color: theme.textPrimary }]}>Log Out</Text>
      </TouchableOpacity></View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Image source={{ uri: modalImage }} style={styles.modalImage} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
