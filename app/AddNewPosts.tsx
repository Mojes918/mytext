import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API, graphqlOperation } from "aws-amplify";
import { createPost } from "../src/graphql/mutations";
import { useRoute } from "@react-navigation/native";

const AddPost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [recentPics, setRecentPics] = useState([]);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const textColor = isDarkMode ? "white" : "black";
  const textInputColor = isDarkMode ? "#222" : "#f0f0f0";
  const backgroundColor = isDarkMode ? "#121212" : "#ffffff";


  const route=useRoute();
const {id}=route.params||null;


  useEffect(() => {
    fetchRecentImages();
  }, []);

  // Fetch recent images from the gallery
  const fetchRecentImages = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Gallery access is required!");
      return;
    }

    const recentPhotos = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 16, // Limit to 15 most recent photos
    });
    setRecentPics(recentPhotos.assets);
  };

  // Handle camera access
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera access is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Handle gallery access
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Handle posting to the backend
  const handlePost = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image!");
      return;
    }
  
    try {
      const input = {
        userID: id, // Replace with the logged-in user's ID
        content: description || null,
        media: selectedImage || null,
        type: "IMAGE", // Example PostType
        
      };

      const response = await API.graphql(graphqlOperation(createPost, { input }));
      Alert.alert("Success", "Your post has been uploaded!");
      console.log("Post created:", response.data.createPost);

      // Reset state after successful post
      setSelectedImage(null);
      setDescription("");
      //router.push('/Social'); // Navigate back to the main screen (adjust as needed)
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to upload post. Please try again.");
    }
  };

  const gridSize = Dimensions.get("window").width / 4 - 2; // For grid items

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Selected Image Placeholder */}
      <View style={[styles.imagePreviewContainer, { backgroundColor }]}>
        {selectedImage ? (
          <>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => setSelectedImage(null)}
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.placeholderImage, { backgroundColor: textInputColor }]} onPress={openGallery}>
            <MaterialIcons name="add-photo-alternate" size={50} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>

      {/* Description Input */}
      <TextInput
        style={[
          styles.descriptionInput,
          { backgroundColor: textInputColor, color: textColor },
        ]}
        placeholder="Add a description..."
        placeholderTextColor="#aaa"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={{alignItems:"center",justifyContent:"center"}}>
          <Text style={{fontSize:20,fontWeight:"bold",color:textColor}}>Recents^</Text>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={openCamera}>
          <MaterialIcons name="photo-camera" size={30} color="#fff" />
          <Text style={styles.actionText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={openGallery}>
          <Feather name="image" size={30} color="#fff" />
          <Text style={styles.actionText}>Gallery</Text>
        </TouchableOpacity>
        
      </View>

      {/* Recent Pictures Grid */}
      <FlatList
        data={recentPics}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedImage(item.uri)}>
            <Image
              source={{ uri: item.uri }}
              style={[styles.gridImage, { width: gridSize, height: gridSize }]}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={4}
        columnWrapperStyle={styles.gridWrapper}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  closeIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 2,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  descriptionInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginTop:10,
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: "top",
    height: 80,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    marginTop: 5,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gridContainer: {
    paddingBottom: 30,
  },
  gridWrapper: {
    justifyContent: "space-between",
  },
  gridImage: {
    margin: 1,
    borderRadius: 5,
  },
});

export default AddPost;
