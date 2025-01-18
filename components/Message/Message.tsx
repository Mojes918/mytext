import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Pressable,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import { getMessage, getUser } from '../../src/graphql/queries';
import { format } from 'date-fns';
import { S3Image } from 'aws-amplify-react-native';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as subscriptions from '../../src/graphql/subscriptions';
import { PanGestureHandler } from 'react-native-gesture-handler';

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

const Message = ({ message, isFirst, isSameUser, setAsMessageReply, messageReply, authUserId, fetchUser }: MessageProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const [repliedMessage, setRepliedMessage] = useState<MessageProps | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [user, setUser] = useState<User | null>(null);
  const [isMe, setIsMe] = useState(false);
  const [soundUri, setSoundUri] = useState<string | null>(null);
  const [replyTitle, setReplyTitle] = useState(null);
  const [scheduleMessage,setScheduleMessage]=useState("Hello");
  const [scheduleTime,setScheduleTime]=useState("12/1/2025 2:40PM");
  const senderName = replyTitle?.userID === authUserId ? "You" : fetchUser?.name;
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const translateX = new Animated.Value(0);
  let isSwipeAction = false; // Track if it's a swipe action or scroll
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Currently selected image


  const onImagePress = (imageKey: string) => {
    setSelectedImage(imageKey);
    setModalVisible(true);
    setIsImageFullScreen(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setIsImageFullScreen(false);
  };



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

  useEffect(() => {
    if (message?.replyToMessageId) {
      const fetchMessageReply = async () => {
        try {
          const fetchedMessageReply: any = await API.graphql(
            graphqlOperation(getMessage, { id: message.replyToMessageId })
          );
          setRepliedMessage(fetchedMessageReply.data.getMessage || null);
          setReplyTitle(fetchedMessageReply.data.getMessage || null);
        } catch (error) {
          console.error('Error fetching replied message:', error);
        }
      };
      fetchMessageReply();
    }
  }, [message.replyToMessageId]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: any = await API.graphql({
          query: getUser,
          variables: { id: message.userID },
        });

        setUser(userData?.data?.getUser || null);
      } catch (error) {
        console.error(`Error fetching user with ID ${message.userID}:`, error);
      }
    };
    fetchUser();
  }, [message.userID]);

  // Check if the message is from the current user
  useEffect(() => {
    const checkIfMe = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setIsMe(user?.id === authUser.attributes.sub);
      } catch (error) {
        console.error('Error checking user identity:', error);
      }
    };
    if (user) checkIfMe();
  }, [user]);

  // Subscribe to message updates
  useEffect(() => {
    const subscription = API.graphql({
      query: subscriptions.onUpdateMessage,
    }).subscribe({
      next: ({ value }) => {
        const updatedMessage = value.data.onUpdateMessage;
        if (updatedMessage.id === message.id) {
          setCurrentMessage((prev) => ({
            ...prev,
            ...updatedMessage,
          }));
        }
      },
      error: (error) => console.error('Subscription error:', error),
    });

    return () => subscription.unsubscribe();
  }, [message.id]);

  if (!user) {
    return <ActivityIndicator style={{ margin: 5 }} />;
  }

  const formattedDate = format(new Date(currentMessage.createdAt), 'p');

  const containerStyle = [
    styles.container,
    isMe ? styles.rightContainer : styles.leftContainer,
    {
      backgroundColor: isMe
        ? isDarkMode
          ? '#3953a3'
          : '#3777f0'
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
        style={
          containerStyle
        }
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
                        color="white"
                      />
                    )}
                </View>
                {
                  isMe ? (
                    <>
                      <View style={[styles.rightArrowonly, { backgroundColor: isDarkMode ? '#3953a3' : '#3777f0' }]}>

                      </View>
                      <View style={[styles.rightArrowOverlaponly, { backgroundColor: isDarkMode ? '#121212' : '#fff', }]}></View></>
                  ) : (
                    <>
                      <View style={[styles.leftArrowonly, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]}>

                      </View>
                      <View style={[styles.leftArrowOverlaponly, { backgroundColor: isDarkMode ? '#121212' : '#fff', }]}></View></>
                  )
                }

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
                      color="white"
                    />
                  )}
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
          </>
        )}
       
        {message.content && (
          <>
            <View style={styles.row}>
              <View style={styles.messageContent}>
                <Text style={textStyle}>{message.content}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
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
                      color="white"
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 15,
    maxWidth: '80%',
    position: "relative"

  },
  rightArrow: {
    position: "absolute",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },

  rightArrowOverlap: {
    position: "absolute",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20

  },
  leftArrow: {
    position: "absolute",
    backgroundColor: "#dedede",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10
  },

  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20

  },
  rightArrowonly: {
    position: "absolute",
    width: 20,
    height: 25,
    bottom: -5,
    borderBottomLeftRadius: 25,
    right: -15
  },

  rightArrowOverlaponly: {
    position: "absolute",
    width: 20,
    height: 35,
    bottom: -10,
    borderBottomLeftRadius: 18,
    right: -30

  },
  leftArrowonly: {
    position: "absolute",
    backgroundColor: "#dedede",
    width: 20,
    height: 25,
    bottom: -5,
    borderBottomRightRadius: 25,
    left: -15
  },

  leftArrowOverlaponly: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    width: 20,
    height: 35,
    bottom: -10,
    borderBottomRightRadius: 18,
    left: -30

  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  messageContent: {
    maxWidth: '75%',
  },
  imageContainer: {
    alignItems: 'flex-end',
  },
  leftContainer: {
    alignSelf: 'flex-start',

  },
  rightContainer: {
    alignSelf: 'flex-end',

  },
  replyWrapper: {
    marginBottom: 2, // Add some space between the reply and the main message
  },
  replyContainer: {
    backgroundColor: '#d4f8e8', // Light green background for the reply
    padding: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#34b7f1', // Add a blue line on the left
  },
  replyUser: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#075e54', // Dark green text for the username
    marginBottom: 2,
  },
  replyContent: {
    fontSize: 14,
    color: '#000', // Black text for the content
  },
  replyImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginTop: 5,
  },
  replyAudioContainer: {
    backgroundColor: '#d4f8e8', // Light green background to match the reply container
    padding: 8,
    borderRadius: 10,
    marginTop: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#34b7f1',
    flexDirection: "row"// Blue line for reply differentiation
  },
});

export default Message;
