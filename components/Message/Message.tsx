import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { format } from 'date-fns';
import { S3Image } from 'aws-amplify-react-native';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as subscriptions from '../../src/graphql/subscriptions';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {styles}from "./messagestyles";
import { useRouter } from 'expo-router';
import { useQuery} from '@apollo/client';
import { GET_MESSAGE, GET_USER} from '@/src/graphql/operations';
interface MessageProps {
  message: {
    id: string;
    audio: string;
    content: string;
    userID: string;
    createdAt: string;
    image?: string;
    status: string;
    replyToMessageId: string;
  };
  isFirst: boolean;
  isSameUser: boolean;
  setAsMessageReply: any;
  messageReply: any;
  authUserId: string;
  fetchUser: any;
}

interface User {
  id: string;
  name: string;
}

const Message = ({ message,setAsMessageReply, authUserId, fetchUser }: MessageProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const [repliedMessage, setRepliedMessage] = useState<MessageProps | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [user, setUser] = useState<User | null>(null);
  
  const [soundUri, setSoundUri] = useState<string | null>(null);
  const [replyTitle, setReplyTitle] = useState(null);
  const senderName = replyTitle?.userID === authUserId ? "You" : fetchUser?.name;
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const translateX = new Animated.Value(0);
  let isSwipeAction = false; // Track if it's a swipe action or scroll
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Currently selected image


  const router = useRouter();

  const onImagePress = (imgKey:string) => {
    router.push({ pathname:'/ImageViewScreen', params: { imgKey } });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setIsImageFullScreen(false);
  };


  const isMe = message.userID === authUserId || message.status === "SENDING";

  // Detect swipe gestures
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    const { translationX } = event.nativeEvent;
    const swipeThreshold = 50; // Minimum swipe distance to trigger reply action

    if (Math.abs(translationX) > swipeThreshold) {
      isSwipeAction = true; // Trigger swipe-to-reply action
      setAsMessageReply(message); // Trigger reply
    } else {
      isSwipeAction = false; // Allow scroll gesture
    }

    // Reset translateX after gesture
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Load audio if present
  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio)
        .then(setSoundUri)
        .catch((error) => console.error('Error loading audio:', error));
    }
  }, [message.audio]);

  
  
  const { data: userData } = useQuery(GET_USER, {
    variables: { id: message.userID },
    skip: !message.userID,
  });

  const { data: repliedMessageData } = useQuery(GET_MESSAGE, {
    variables: { id: message.replyToMessageId },
    skip: !message.replyToMessageId,
  });

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateMessage)
    ).subscribe({
      next: ({ value }) => {
        const updatedMessage = value.data.onUpdateMessage;
        if (updatedMessage.id === message.id) {
          setCurrentMessage((prevMessage) => ({
            ...prevMessage,
            status: updatedMessage.status,
          }));
        }
      },
      error: (error) => console.warn("Subscription error:", error),
    });
  
    return () => subscription.unsubscribe();
  }, [message.id]);
  
  

  useEffect(() => {
    if (userData?.getUser) {
      setUser(userData.getUser);
    }
    if (repliedMessageData?.getMessage) {
      setRepliedMessage(repliedMessageData.getMessage);
    }
  }, [userData?.getUser, repliedMessageData]);


  
  
  if (!user) {
    return ;
  }

  const formattedDate = format(new Date(currentMessage.createdAt), 'p');

  const containerStyle = [
    message.content?styles.container:styles.othercontainer,
    
    isMe ? styles.rightContainer : styles.leftContainer,
    {
      backgroundColor: isMe
        ? isDarkMode
          ? '#3953a3'
          : "#007AFF"
        : isDarkMode
          ? '#333'
          : '#e0e0e0',
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      transform: [{ translateX }],
    },
    isHighlighted && { borderColor: 'blue', borderWidth: 2 },
  ];

  const textStyle = {
    color: isMe ? 'white' : isDarkMode ? 'white' : 'black',
  };

  const timestampStyle = {
    fontSize: 10,
    color: isMe ? 'white' : isDarkMode ? 'white' : 'gray',
    marginTop: 5,
  };

 

  return (<>
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-10, 10]} 
    >
      <Animated.View
        style={message.content ? containerStyle : containerStyle}
      >


        {/* Right tail for sent messages */}

        {repliedMessage && (
          <View style={styles.replyWrapper}>
            <View style={styles.replyContainer}>
              {/* Display the name of the sender of the replied message */}
              <Text style={styles.replyUser}>{senderName}</Text>
              {/* Display the content of the replied message */}
              {repliedMessage.content && (
                <Text style={styles.replyContent}>{repliedMessage.content}</Text>
              )}
              {/* Display the image if the replied message contains one */}
              {repliedMessage.image && (
                <S3Image
                  imgKey={repliedMessage.image}
                  style={styles.replyImage}
                  resizeMode="cover"
                />
              )}
              {/* Display the audio if the replied message contains one */}
              {repliedMessage?.audio && (
                <View style={styles.replyAudioContainer}>
                  <Text>Voice Message</Text>
                  <MaterialCommunityIcons
                    name="microphone-outline"
                    size={24}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {message.image && (
          <Pressable style={styles.imageContainer} onPress={() => onImagePress(message.image)}>
            <S3Image
              imgKey={message.image}
              style={{
                width: width * 0.7,
                aspectRatio: 4 / 3,
                borderRadius: 10,
                marginBottom: 5,
              }}
              resizeMode="cover"
            />

            {!message.content && (
              <>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text style={timestampStyle}>{formattedDate} </Text>
                  {isMe &&
                    currentMessage.status !== 'SENT' &&
                    currentMessage.status && (
                      <Ionicons
                        name={
                          currentMessage.status === 'DELIVERED'
                            ? 'checkmark'
                            : 'checkmark-done'
                        }
                        size={16}
                        color={currentMessage.status === 'READ'?"#a2f9fc":"white"}
                      />
                    )}
                </View>


              </>
            )}
          </Pressable>
        )}
        {soundUri && (
          <>
            <AudioPlayer soundUri={soundUri} onClose={() => setSoundUri(null)} />
            {!message.content && (<>
              <View style={{ flexDirection: "row", gap: 10, justifyContent: "flex-end" }}>
                <Text style={timestampStyle}>{formattedDate}</Text>
                {isMe &&
                  currentMessage.status !== 'SENT' &&
                  currentMessage.status && (
                    <Ionicons
                      name={
                        currentMessage.status === 'DELIVERED'
                          ? 'checkmark'
                          : 'checkmark-done'
                      }
                      size={16}
                      color={currentMessage.status === 'READ'?"#a2f9fc":"white"}
                    />
                  )}
              </View>
            </>
            )}
          </>
        )}
       
        {message.content && (
          <>
            <View style={styles.row}>
              <View style={styles.messageContent}>
                <Text style={textStyle}>{message.content}</Text>
                {message.status === "SENDING" && <ActivityIndicator size="large" />}
                {message.status === "FAILED" && <Text style={{ color: "red" }}>Failed to send</Text>}
              </View>
              <View style={{ flexDirection: 'row', gap: 10,marginRight:10 }}>
                <Text style={timestampStyle}>{formattedDate}</Text>
                {isMe &&
                  currentMessage.status !== 'SENT' &&
                  currentMessage.status && (
                    <Ionicons
                      name={
                        currentMessage.status === 'DELIVERED'
                          ? 'checkmark'
                          : 'checkmark-done'
                      }
                      size={20}
                      color={currentMessage.status === 'READ'?"#a2f9fc":"white"}
                    />
                  )}
              </View>
            </View>
            {
              isMe ? (
                <>
                  <View style={[styles.rightArrow, { backgroundColor: isDarkMode ? '#3953a3' : '#3777f0' }]}>

                  </View>
                  <View style={[styles.rightArrowOverlap, { backgroundColor: isDarkMode ? '#121212' : '#fff', }]}></View></>
              ) : (
                <>
                  <View style={[styles.leftArrow, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]}>

                  </View>
                  <View style={[styles.leftArrowOverlap, { backgroundColor: isDarkMode ? '#121212' : '#fff', }]}></View></>
              )
            }
          </>
        )}


      </Animated.View>
    </PanGestureHandler>
    <Modal
    visible={isModalVisible}
    transparent={true}
    animationType="fade"
    onRequestClose={closeModal}
  ><TouchableWithoutFeedback onPress={closeModal}>
    <View style={styles.modalContainer}>
     
      {selectedImage && (
        <S3Image
          imgKey={selectedImage}
          style={styles.fullscreenImage}
          resizeMode="contain"
        />
      )}
    </View>
    </TouchableWithoutFeedback>
  </Modal></>
  );
};

export default Message;