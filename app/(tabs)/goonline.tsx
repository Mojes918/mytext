import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import { API, Auth } from 'aws-amplify';
import * as mutations from '../../src/graphql/mutations';
import { getChatRoom, getRandomChatQueue, getRandomMessage, listRandomChatQueues, listRandomChatRoomUsers } from '@/src/graphql/queries';
import RandomChatListItem from '@/components/ChatList/RandomChatListItem';
import { ChatRoom } from '../types/types';
import { useFocusEffect } from '@react-navigation/native';
import { onCreateRandomMessage } from '@/src/graphql/subscriptions';

function GoOnlineScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const textColor = isDarkMode ? 'white' : 'black';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingTimeout, setMatchingTimeout] = useState<NodeJS.Timeout | null>(null);

    const fetchChatRooms = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        const userId = userData.attributes.sub;
        const chatRoomUsersResponse = await API.graphql({
          query: listRandomChatRoomUsers,
          variables: {
            filter: { userId: { eq: userId } },
            limit: 100,
          },
        }) as any;
  
        const chatRoomsData = chatRoomUsersResponse.data?.listRandomChatRoomUsers.items || [];
        if (!chatRoomsData.length) return;
  
        const chatRoomIds = chatRoomsData.map((randomChatRoomUser) => randomChatRoomUser.chatRoomId).filter(Boolean);
  
        const fetchedChatRooms = await Promise.all(
          chatRoomIds.map(async (chatRoomId) => {
            const chatRoomResponse = await API.graphql({
              query: getChatRoom,
              variables: { id: chatRoomId },
            });
  
            const chatRoom = chatRoomResponse.data?.getChatRoom;
            if (!chatRoom) return null;
   let lastMessage = null;
            if (chatRoom.chatRoomLastMessageId) {
              const lastMessageResponse = await API.graphql({
                query: getRandomMessage,
                variables: { id: chatRoom.chatRoomLastMessageId },
              });
              lastMessage = lastMessageResponse?.data?.getRandomMessage || null;
            }
            return chatRoom;
          })
        );
  
        // Sort by lastMessageAt (if available) or fallback to createdAt
        const sortedChatRooms = fetchedChatRooms
          .filter(Boolean) // Remove null values
          .sort((a, b) => {
            const dateA = new Date(a.lastMessageAt || a.createdAt).getTime();
            const dateB = new Date(b.lastMessageAt || b.createdAt).getTime();
            return dateB - dateA; // Sort in descending order
          });
  
        setChatRooms(sortedChatRooms);
      } catch (error) {
        console.error("Error fetching chat rooms", error);
      }
    };
  

     
  useFocusEffect(
    React.useCallback(() => {
      fetchChatRooms();
    }, [chatRooms]) // ✅ Adding chatRooms as a dependency ensures re-fetching when data updates
  );



useEffect(() => {
  const subscription = API.graphql({
    query: onCreateRandomMessage,
  }).subscribe({
    next: async ({ value }) => {
      try {
        const newMessage = value.data.onCreateRandomMessage;
        setChatRooms((prev) =>
          prev.map((room) =>
            room.id === newMessage.randomChatRoomID
              ? { ...room, LastMessage: newMessage }
              : room
          )
        );
      } catch (error) {
        console.error("Error handling new message:", error);
      }
        
        // Update chat room list with the new message count
        fetchChatRooms(); // Fetch updated chat rooms if necessary
    
    
    },
    error: (error) => console.error("Subscription error:", error),
  });

  return () => {
    subscription.unsubscribe();
    
  };
}, []);


useEffect(() => {
  return () => {
    if (isMatching) {
      handleCancelMatching();
    }
  };
}, []);

const handleCancelMatching = async () => {
  try {
    setIsMatching(false);
    if (matchingTimeout) clearTimeout(matchingTimeout);

    const authUser = await Auth.currentAuthenticatedUser();
    const authUserId = authUser.attributes.sub;

    // Find the queue entry for the current user
    const queueListResponse = await API.graphql({
      query: listRandomChatQueues,
      variables: { filter: { userID: { eq: authUserId }, status: { eq: "WAITING" } }, limit: 1 },
    }) as any;

    const queueEntry = queueListResponse.data.listRandomChatQueues.items[0];

    if (queueEntry) {
      // Either delete the entry or update status to "CANCELED"
      await API.graphql({
        query: mutations.deleteRandomChatQueue,
        variables: { input: { id: queueEntry.id } },
      });
    }
    //console.log("Matching canceled and queue entry removed.");
  } catch (error) {
    console.error("Error canceling matching:", error);
  }
};

const handleGoOnline = async () => {
  try {
    const authUser = await Auth.currentAuthenticatedUser();
    const authUserId = authUser.attributes.sub;
    setIsMatching(true);

   // Auto-cancel after 2 minutes
const timeout = setTimeout(async () => {
  //console.log("Matching timed out, removing user from queue.");
  await handleCancelMatching();
}, 2 * 60 * 1000);

    setMatchingTimeout(timeout);

    const queueResponse = await API.graphql({
      query: mutations.createRandomChatQueue,
      variables: { input: { userID: authUserId, status: "WAITING", chatRoomId: null } },
    });

    const queueEntry = queueResponse.data.createRandomChatQueue;

    let matchedUser = null;
    let userFound = false;
    let assignedChatRoomId = null;

    while (!userFound) {
      const updatedQueueResponse = await API.graphql({
        query: getRandomChatQueue,
        variables: { id: queueEntry.id },
      });

      const queueData = updatedQueueResponse.data.getRandomChatQueue;
      if (!queueData) return;

      if (queueData.status === "MATCHED") {
        if (queueData.chatRoomId) {
          setIsMatching(false);
          clearTimeout(matchingTimeout!); // Stop timeout if matched
          router.push({ pathname: '/OnlineChatRoom', params: { chatRoomId: queueData.chatRoomId } });
          return;
        }
      }

      const queueListResponse = await API.graphql({
        query: listRandomChatQueues,
        variables: { filter: { status: { eq: "WAITING" } }, limit: 100 },
      });

      const waitingUsers = queueListResponse.data.listRandomChatQueues.items.filter(
        (user) => user.userID !== authUserId
      );

      if (waitingUsers.length > 0) {
        matchedUser = waitingUsers[0];

        const chatRoomResponse = await API.graphql({
          query: mutations.createChatRoom,
          variables: { input: { type: "RANDOM" } },
        });

        assignedChatRoomId = chatRoomResponse.data.createChatRoom.id;

        await Promise.all([
          API.graphql({
            query: mutations.updateRandomChatQueue,
            variables: { input: { id: queueEntry.id, status: "MATCHED", chatRoomId: assignedChatRoomId } },
          }),
          API.graphql({
            query: mutations.updateRandomChatQueue,
            variables: { input: { id: matchedUser.id, status: "MATCHED", chatRoomId: assignedChatRoomId } },
          }),
        ]);

        await Promise.all([
          API.graphql({
            query: mutations.createRandomChatRoomUser,
            variables: { input: { chatRoomId: assignedChatRoomId, userId: authUserId } },
          }),
          API.graphql({
            query: mutations.createRandomChatRoomUser,
            variables: { input: { chatRoomId: assignedChatRoomId, userId: matchedUser.userID } },
          }),
        ]);

        setIsMatching(false);
        clearTimeout(matchingTimeout!); // Stop timeout if matched
        router.push({ pathname: '/OnlineChatRoom', params: { chatRoomId: assignedChatRoomId } });

        return;
      } else {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    setIsMatching(false);
    clearTimeout(matchingTimeout!);
    console.error("Error in handleGoOnline:", error);
  }
};

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {isMatching ? (
        <View style={styles.animationContainer}>
    <LottieView 
      source={require('../../assets/animations/matching-animation.json')} 
      autoPlay 
      loop={true} 
      style={styles.lottie} 
    />
    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelMatching}>
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              Go Online & Chat with Real Contacts!
            </Text>
            <Text style={[styles.instructions, { color: textColor }]}>
              Be respectful. No hate speech. Keep it fun and friendly!
            </Text>
            <Text style={[styles.instructions, { color: textColor }]}>
              By Clicking on the GO ONLINE you will Match with some random real conatct and redirect to Chat with them 
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleGoOnline}>
              <Text style={styles.buttonText}>Go Online</Text>
            </TouchableOpacity>
          </View>

          {/* FlatList now positioned properly below the button */}
          <View style={styles.chatListContainer}>
            <FlatList
              data={chatRooms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => item ? <RandomChatListItem chatRoom={item} /> : null}
              ListHeaderComponent={() => (<>
                <Text style={[styles.chatListHeader,{color:textColor}]}>Random Chats</Text>
                <Text style={{fontSize:12,marginLeft:10,marginBottom:10,color:textColor}}>The old inactive chats will be deleted automatically</Text>
                </>
              )}
              ListEmptyComponent={
                <View style={styles.emptyChatContainer}>
                  <Text style={[styles.emptyChatText, { color: textColor }]}>No chats yet.</Text>
                  <Text style={[styles.emptyChatText, { color: textColor }]}>
                    Get Started by Going Online.
                  </Text>
                </View>
              }
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  }, animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,  // Adjust size as needed
    height:300, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },cancelButton: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  chatListContainer: {
    flex: 1, 
    width: '100%',
  },
  chatListHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  emptyChatContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  emptyChatText: {
    fontSize: 16,
  }
});

export default GoOnlineScreen;
