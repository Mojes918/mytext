import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Alert,
  useColorScheme,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Dimensions,
  Animated

} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API, Auth, Storage } from 'aws-amplify';
import * as mutations from '../../src/graphql/mutations';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import {Audio, AVPlaybackStatus}from"expo-av";
//import EmojiPicker from 'rn-emoji-keyboard'; 
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import Modal from 'react-native-modal';





const MessageInput = ({ chatRoom }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording|null>(null);
  const [sound, setSound] = useState<Audio.Sound|null>(null);
  const [paused,setPaused]=useState(true);
  const [audioProgress,setAudioProgress]=useState(0);
  const [audioDuration,setAudioDuration]=useState(0);
  const [soundUri,setSoundUri]=useState<string|null>(null);
  //const [waveform, setWaveform] = useState<number[]>([]);


  const resetField = () => {
    setMessage('');
    setIsEmojiOpen(false);
    setImage(null);
    setProgress(0);
    setSound(null);
    setSoundUri(null)
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
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      const newMessage = await API.graphql({
        query: mutations.createMessage,
        variables: {
          input: {
            content: message,
            userID: user.attributes.sub,
            chatroomID: chatRoom.id,
          },
        },
      });

      await API.graphql({
        query: mutations.updateChatRoom,
        variables: {
          input: {
            id: chatRoom.id,
            chatRoomLastMessageId: newMessage.data.createMessage.id,
          },
        },
      });

      resetField();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send the message.');
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async () => {
    if (!image) return;

    try {
      const blob = await getBlob(image);
      if (!blob) {
        console.log('Failed to create blob from image URI');
        return;
      }

      const { key } = await Storage.put(`${uuid.v4()}.png`, blob, {
        progressCallback: (progress) => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setProgress(progress.loaded / progress.total);
        },
      });

      const user = await Auth.currentAuthenticatedUser();
      const newMessage = await API.graphql({
        query: mutations.createMessage,
        variables: {
          input: {
            content: message || '',
            image: key,
            userID: user.attributes.sub,
            chatroomID: chatRoom.id,
          },
        },
      });

      await API.graphql({
        query: mutations.updateChatRoom,
        variables: {
          input: {
            id: chatRoom.id,
            chatRoomLastMessageId: newMessage.data.createMessage.id,
          },
        },
      });

      resetField();
    } catch (error) {
      console.error('Error sending image:', error);
      Alert.alert('Error', 'Failed to send the image.');
    } finally {
      setLoading(false);
    }
  };

  const getBlob = async (uri:string) => {
    try {
      const response = await fetch(uri);
      return await response.blob();
    } catch (error) {
      console.error('Error fetching image blob:', error);
    }
  };

  const onPress = () => {
    if (image) {
      sendImage();
    }else if(soundUri){
      sendAudio();
    }
     else if (message) {
      sendMessage();
    } else {
      Alert.alert('Action Required', 'Please enter a message or pick an image.');
    }
  };

  const toggleEmojiSelector = useCallback(() => {
    setIsEmojiOpen((prev) => !prev);
  }, []);

  const inputBackgroundColor = isDarkMode ? '#333' : 'lightgray';
  const iconColor = isDarkMode ? '#fff' : '#000';
  const iconbackgroundColor=isDarkMode?"#333":"lightgray";



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



const sendAudio = async () => {
  if (!soundUri) return;

  try {
    const blob = await getBlob(soundUri);
    if (!blob) {
      console.log('Failed to create blob from image URI');
      return;
    }

    const uriParts=soundUri.split(".");
    const extension=uriParts[uriParts.length-1];

    const { key } = await Storage.put(`${uuid.v4()}.${extension}`, blob, {
      progressCallback: (progress) => {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        setProgress(progress.loaded / progress.total);
      },
    });

    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await API.graphql({
      query: mutations.createMessage,
      variables: {
        input: {
          content: message || '',
          audio: key,
          userID: user.attributes.sub,
          chatroomID: chatRoom.id,
        },
      },
    });

    await API.graphql({
      query: mutations.updateChatRoom,
      variables: {
        input: {
          id: chatRoom.id,
          chatRoomLastMessageId: newMessage.data.createMessage.id,
        },
      },
    });

    resetField();
  } catch (error) {
    console.error('Error sending image:', error);
    Alert.alert('Error', 'Failed to send the image.');
  } finally {
    setLoading(false);
  }
};



const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = () => {
   // Keyboard.dismiss(); // Disable the keyboard
   console.log("handlle emoji picker");
    setShowEmojiPicker(!showEmojiPicker); // Toggle emoji picker
    console.log("showemojipicker",showEmojiPicker);
  };

  const handleEmojiSelect = ( emoji: string ) => {
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to input
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setMenuVisible(false); // Ensure menu is hidden when keyboard shows
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  const menuHeight = useRef(new Animated.Value(0)).current; 
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const toggleMenu = () => {
    if (isMenuVisible) {
      // Close menu
      Animated.timing(menuHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      Keyboard.dismiss(); // Dismiss keyboard
      setMenuVisible(true); // Show menu
      Animated.timing(menuHeight, {
        toValue: screenHeight * 0.35, // Menu height
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const menuOptions = [
    { id: 1, name: 'Document', icon: 'file-document-outline' },
    { id: 2, name: 'Camera', icon: 'camera-outline' },
    { id: 3, name: 'Gallery', icon: 'image-outline' },
    { id: 4, name: 'Audio', icon: 'microphone-outline' },
    { id: 5, name: 'Location', icon: 'map-marker-outline' },
    { id: 6, name: 'Payment', icon: 'currency-inr' },
    { id: 7, name: 'Contact', icon: 'account-outline' },
    { id: 8, name: 'Poll', icon: 'poll' },
  ];
  const onfocuspress=()=>{
    setMenuVisible(false); // Hide menu when input is focused
    Animated.timing(menuHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
     setShowEmojiPicker(false)
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { marginBottom: 30 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      {image && (
        <View style={styles.sendImageContainer}>
          <Image source={{ uri: image }} style={{ height: 110, width: 110, borderRadius: 10 }} />
          <View
          style={{flex:1,justifyContent:"flex-start",alignSelf:"flex-end"}}>
          <View style={{height:5,borderRadius:5,backgroundColor:"#3777f0",width:`${progress*100}%`}}/>
          </View>
          <AntDesign name="closecircleo" size={24} color="black" onPress={() => setImage(null)} />
        </View>
      )}

      {soundUri && (
       <AudioPlayer soundUri={soundUri} onClose={()=>setSoundUri(null)}/>
      )}

      <View style={styles.row}>
        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <TouchableOpacity onPress={handleEmojiClick} style={styles.iconContainer}>
            <Entypo name="emoji-happy" size={24} color={iconColor}  />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: iconColor }]}
            placeholder="Type a message..."
            placeholderTextColor={isDarkMode ? '#aaa' : 'gray'}
            value={message}
            onFocus={onfocuspress}
            onChangeText={setMessage}
            multiline
          />
          {
            message.trim()===''?(
              <>
              <Pressable onPress={pickImage} style={styles.iconContainer}>
            <Feather name="image" size={22} color={iconColor} />
            </Pressable>
              <Pressable  onPressIn={startRecording}
              onPressOut={stopRecording}
              style={[styles.iconContainer]}
              >
            <MaterialCommunityIcons
              name={recording?"microphone":"microphone-outline"}
              size={recording?40:24}
              color={recording?"red":iconColor}
              style={styles.icon}
             
            />
            </Pressable>
            
            </>
            ):(
              <Pressable style={styles.iconContainer} onPress={toggleMenu}>
              <Feather name="plus" size={24} color={iconColor} />
              </Pressable>
            )
          }
          
        </View>
  
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : message || image ||soundUri? (
            <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
           <MaterialCommunityIcons name="send-lock" size={26} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleMenu} style={styles.buttonContainer}>
            <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
          )}
        
      </View>
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={handleEmojiSelect}
          showSearchBar={false} // Disable search bar for simplicity
          columns={8} // Adjust the number of columns to fit your design
        />
      )}
       <Animated.View
        style={[
          styles.menuContainer,
          {
            height: menuHeight, // Animated height
          },
        ]}
      >
        <FlatList
          data={menuOptions}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                console.log(`${item.name} clicked`);
                toggleMenu(); // Hide menu after selecting an item
              }}
            >
              <MaterialCommunityIcons name={item.icon} size={30} color={iconColor} />
              <Text style={[styles.menuText]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { padding: 10, marginBottom: 50 },
  row: { flexDirection: 'row' },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginRight: 5,
    padding: 5,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 16, borderRadius: 25 },
  icon: {  },
  buttonContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3777f0',
    borderRadius: 25,
    
  },
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#3777f0',
    borderRadius: 25,
    
  },
  sendImageContainer: {
    flexDirection: 'row',
    margin: 10,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  sendAudioContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding:15,
    alignItems:"center",
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    
  },
  AudioBackground:{
    height:5,
    flex:1,
    backgroundColor:"lightgray",
    borderRadius:5,
    margin:10
  },
  menuContainer: {
    //backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    alignItems:"center",
    padding:10
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: 70,
  },
  menuText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color:"gray"
  },
});

export default MessageInput;



