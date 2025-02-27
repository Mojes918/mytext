import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import {Audio, AVPlaybackStatus}from"expo-av";
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { S3Image } from 'aws-amplify-react-native';
import {styles} from "./styles"
import { useRouter } from 'expo-router';
import { CREATE_MESSAGE,UPDATE_CHATROOM, UPDATE_MESSAGE } from '@/src/graphql/operations';
import { useMutation } from '@apollo/client';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useApolloClient } from "@apollo/client";
const MessageInput = ({ chatRoom,messageReply,removeMessageReply,authUserId,user }) => {
  const [messages, setMessages] = useState([]); 
const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording|null>(null);
  const [sound, setSound] = useState<Audio.Sound|null>(null);
  const [paused,setPaused]=useState(true);
  const [audioProgress,setAudioProgress]=useState(0);
  const [audioDuration,setAudioDuration]=useState(0);
  const [soundUri,setSoundUri]=useState<string|null>(null);
  const inputBackgroundColor = isDarkMode ? '#1d1d1d' : '#ddd';
  const iconColor = isDarkMode ? '#fff' : '#000';
  const iconbackgroundColor=isDarkMode?"#333":"lightgray";
  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [updateChatRoom] = useMutation(UPDATE_CHATROOM);
  const [updateMessage] = useMutation(UPDATE_MESSAGE);
  
  const senderName =
  messageReply?.userID === authUserId ? "You" :user?.name;

const router=useRouter();
  const resetField = () => {
    setMessage('');
    setImage(null);
    setProgress(0);
    setSound(null);
    setSoundUri(null);
    removeMessageReply();
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const libraryResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
        await Audio.requestPermissionsAsync();
        if (libraryResponse.status !== 'granted' || photoResponse.status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable built-in cropping
      quality: 0.7,
    });
  
    if (!result.canceled) {
      router.push({pathname:'/ImagePreviewScreen', params:{ imageUri: result.assets[0].uri ,ChatroomId:chatRoom?.id,authUserId:authUserId}});
    }
  };
  const client=useApolloClient()
    
  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const tempId = `temp-${Date.now()}`;
  
    const tempMessage = {
      id: tempId,  // Temporary ID
      content: message,
      userID: authUserId,
      chatroomID: chatRoom?.id,
      status: "SENT",
      createdAt: new Date().toISOString(),
    };
  
    /*
    setMessages((prevMessages) => [tempMessage, ...prevMessages]);
  */
    resetField();
  
    try {
      const { data } = await createMessage({
        variables: {
          input: {
            content: message,
            userID: authUserId,
            chatroomID: chatRoom?.id,
            status: "SENT",
            replyToMessageId: messageReply?.id,
          },
        },
      });
  
      const newMessage = data.createMessage;
  
    /*  // ✅ Update Apollo Cache, replacing temp message
      client.cache.updateQuery(
        {
          query: LIST_MESSAGES,
          variables: { filter: { chatroomID: { eq: chatRoom?.id } }, limit: 1000 },
        },
        (existingData) => {
          return {
            listMessages: {
              ...existingData.listMessages,
              items: [
                newMessage, // Add the new message
                ...existingData.listMessages.items.filter((msg) => msg.id !== tempId), // Remove temp message
              ],
            },
          };
        }
      );*/
  
      // ✅ Update Chatroom Last Message
      await updateChatRoom({
        variables: {
          input: {
            id: chatRoom?.id,
            chatRoomLastMessageId: newMessage.id,
          },
        },
      });
  
      // ✅ Mark message as delivered
      await updateMessage({
        variables: {
          input: {
            id: newMessage.id,
            status: "DELIVERED",
          },
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send the message.");
    }
  };
  

   const takePhoto = async () => {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
  
      if (!result.canceled) {
        router.push({pathname:'/ImagePreviewScreen', params:{ imageUri: result.assets[0].uri ,ChatroomId:chatRoom?.id,authUserId:authUserId}});
      }
    };
  


  const onPress = () => {
     if (soundUri) {
      sendAudio(soundUri, audioDuration); // Pass audio URI and duration
    } else if (message.trim()) {
      sendMessage();
    } else {
      Alert.alert("Action Required", "Please enter a message or pick an image.");
    }
  };
  



//Audio

const onPlaybackStatusUpdate=(status:AVPlaybackStatus)=>{
  if(!status.isLoaded){
return;

  }
  setAudioProgress(status.positionMillis/(status.durationMillis||1));
  setPaused(!status.isPlaying);
  setAudioDuration(status.durationMillis||0)
}


async function startRecording() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log('Starting recording..');
    const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    console.log('Recording started');
  } catch (err) {
    console.error('Failed to start recording', err);
  }
}

async function stopRecording() {
  console.log('Stopping recording..');
  if(!recording){
    return;
  }
  setRecording(null);
  await recording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync(
    {
      allowsRecordingIOS: false,
    }
  );
  const uri = recording.getURI();
  setSoundUri(uri);
  if(!uri){
    return;
  };
  const { sound } = await Audio.Sound.createAsync({uri},{},onPlaybackStatusUpdate);
  setSound(sound);
  

  console.log('Recording stopped and stored at', uri);
}


const sendAudio = async (audioUri: string, duration: number) => {
  if (!audioUri) return;

  const tempMessage = {
    id: `temp-${Date.now()}`,
    content: null,
    audio: audioUri,
    duration: duration,
    userID: authUserId,
    chatroomID: chatRoom?.id,
    status: "SENDING",
    createdAt: new Date().toISOString(),
  };

  // Optimistically update UI
  setMessages((prevMessages) => [tempMessage, ...prevMessages]);

  try {
    const audioUrl = await uploadToS3(audioUri, "audio", undefined);

    const { data } = await createMessage({
      variables: {
        input: {
          content: null,
          audio: audioUrl,
         // duration: duration,
          userID: authUserId,
          chatroomID: chatRoom?.id,
          status: "SENT",
        },
      },
    });

    const newMessage = data.createMessage;

    // Update chat room's last message
    await updateChatRoom({
      variables: {
        input: {
          id: chatRoom?.id,
          chatRoomLastMessageId: newMessage.id,
        },
      },
    });

    // Mark the message as delivered
    await updateMessage({
      variables: {
        input: {
          id: newMessage.id,
          status: "DELIVERED",
        },
      },
    });
resetField();
    // Replace temporary message with real message
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === tempMessage.id ? { ...newMessage, status: "SENT" } : msg
      )
    );
  } catch (error) {
    console.error("Error sending audio:", error);
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === tempMessage.id ? { ...msg, status: "FAILED" } : msg
      )
    );
    Alert.alert("Error", "Failed to send the audio.");
  }
};


  return (
    <KeyboardAvoidingView
      style={[styles.root, { marginBottom: 60 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 60} 
    >
       {messageReply && (
      <View style={[styles.replyContainer, { backgroundColor: iconbackgroundColor }]}>
        {/* Colored Bar */}
        <View style={styles.replyBar} />

        {/* Reply Content */}
        <View style={styles.replyContent}>
          <Text style={styles.replyTitle}>Replying to: {senderName}</Text>
        
          {/* Render Content */}
          {messageReply.content && (
            <Text style={[styles.replyMessage, { color: iconColor }]} numberOfLines={1}>
              {messageReply.content}
            </Text>
          )}
          {messageReply.audio && (
            <Text style={[styles.replyMessage, { color: iconColor }]} numberOfLines={1}>
              🎤 Voice message ({messageReply.audioDuration || "0:00"})
            </Text>
          )}
          {/* Render Image */}
          {messageReply.image && (
            <S3Image
                      imgKey={messageReply.image}
                      style={styles.replyImage}
                      resizeMode="cover"
                    />
          )}
        </View>

        {/* Close Button */}
        <TouchableOpacity onPress={resetField}>
          <AntDesign name="closecircleo" size={24} color="#808080" />
        </TouchableOpacity>
        </View>
       )}
      {soundUri && (
       <AudioPlayer soundUri={soundUri} onClose={()=>setSoundUri(null)}/>
      )}

      <View style={styles.row}>
        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
        <TouchableOpacity onPress={takePhoto} style={styles.cameraContainer}>
            <Entypo name="camera" size={24} color={iconColor}  />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: iconColor }]}
            placeholder="Type a message..."
            placeholderTextColor={isDarkMode ? '#aaa' : 'gray'}
            value={message}
            onChangeText={setMessage}
            multiline
          />
            <TouchableOpacity onPress={pickImage} style={styles.cameraContainer}>
            <Feather name="image" size={22} color={iconColor} />
            </TouchableOpacity>
          
          
        </View>
  {
    message.trim()===''?(
      soundUri||image?(
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <MaterialCommunityIcons name="send-lock" size={20} color="white"/>
         </TouchableOpacity>
    ):(
      <TouchableOpacity
      onLongPress={startRecording}
      onPressOut={stopRecording}
      style={[styles.buttonContainer]}
      >
    <MaterialCommunityIcons
      name={recording?"microphone":"microphone-outline"}
      size={recording?40:24}
      color={"white"}
      style={styles.icon}
     
    />
    </TouchableOpacity>
    )
    
    ):
    (
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <MaterialCommunityIcons name="send-lock" size={20} color="white"/>
       </TouchableOpacity>
    )
  }     
      </View>
    </KeyboardAvoidingView>
  );
};


export default MessageInput;



