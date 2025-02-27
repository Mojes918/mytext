import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@apollo/client';
import { CREATE_MESSAGE, UPDATE_CHATROOM, UPDATE_MESSAGE } from '@/src/graphql/operations';
import { uploadToS3 } from '@/utils/uploadToS3';


const ImagePreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, ChatroomId, authUserId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [updateChatRoom] = useMutation(UPDATE_CHATROOM);
  const [updateMessage] = useMutation(UPDATE_MESSAGE);

  const inputRef = useRef(null);

  // Send Image & Message
  const handleSendMessage = async () => {
    if (!message.trim() && !imageUri) return;

    // Move back immediately
    router.back();

    // Upload Image in Background
    try {
      setIsUploading(true);
      const imageUrl = await uploadToS3(imageUri, "image",undefined);

      const { data } = await createMessage({
        variables: {
          input: {
            content: message.trim() || null,
            image: imageUrl,
            userID: authUserId,
            chatroomID: ChatroomId,
            status: 'SENT',
          },
        },
      });

      const newMessage = data.createMessage;

      await updateChatRoom({
        variables: {
          input: {
            id: ChatroomId,
            chatRoomLastMessageId: newMessage.id,
          },
        },
      });

      await updateMessage({
        variables: {
          input: {
            id: newMessage.id,
            status: 'DELIVERED',
          },
        },
      });
    } catch (error) {
      console.error('Error sending image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.optionsContainer}>
        {/*
        <TouchableOpacity onPress={() => Alert.alert('Crop not implemented')} style={styles.optionButton}>
          <MaterialCommunityIcons name="crop" size={24} color="white" />
          <Text style={styles.optionText}>Crop</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Text not implemented')} style={styles.optionButton}>
          <MaterialCommunityIcons name="format-text" size={24} color="white" />
          <Text style={styles.optionText}>Add Text</Text>
        </TouchableOpacity>*/}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.messageContainer}>
        <TextInput
          ref={inputRef}
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="white"
          multiline
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1, // Ensures the image doesn’t overlap UI elements
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%', // Makes sure the image stays within limits
    resizeMode: 'contain', // Prevents image from overflowing
  },
  optionsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 10, // Ensures options stay on top
  },
  optionButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    borderWidth:1,
    borderColor:"gray",
    borderRadius:15,
    padding: 5,
    zIndex: 10, // Keeps the close button above everything
  },
  messageContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  
    paddingHorizontal: 15,
    zIndex: 10, // Keeps input above image
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(81, 73, 73, 0.3)',
    color: 'white',
    padding: 10,
    borderRadius: 30,
    borderWidth:1,
    borderColor:"gray",
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 30,
    borderWidth:1,
    borderColor:"#121212",
    padding: 10,
  },
});
export default ImagePreviewScreen