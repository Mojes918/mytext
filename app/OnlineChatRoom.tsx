import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser, listRandomMessages } from "@/src/graphql/queries";
import { FontAwesome } from "@expo/vector-icons";
import OnlineMessage from "@/components/Message/OnlineMessage";
import {  onCreateRandomMessage } from "@/src/graphql/subscriptions";
import {  createRandomMessage, updateChatRoom,updateRandomMessage } from "@/src/graphql/mutations";
type MessageType = {
  id: string;
  content: string;
  userID: string;
  chatroomID: string;
  status?: string;
  createdAt?: string;
};
const OnlineChatRoom = () => {
  const { chatRoomId, userId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark'
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);
const [viewableMessageIds, setViewableMessageIds] = useState<string[]>([]);
  // Fetch current authenticated user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setCurrentUserId(authUser.attributes.sub);
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch messages when chatRoomId changes
  useEffect(() => {
    if (!chatRoomId) return;
    fetchMessages();
  }, [chatRoomId]);

  // Fetch chat partner details
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const response = await API.graphql(graphqlOperation(getUser, { id: userId }));
        setUser(response.data?.getUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  // Real-time message subscription
  useEffect(() => {
    if (!chatRoomId) return;
    const subscription = API.graphql(
      graphqlOperation(onCreateRandomMessage, { randomChatRoomID: chatRoomId })
    ).subscribe({
      next: ({ value }) => {
        const newMessage = value.data.onCreateRandomMessage; // Correct field name
        if (!newMessage || !newMessage.id) return; // Prevent undefined errors
    
       // console.log("New message received:", newMessage);
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);
          return exists ? prev : [newMessage, ...prev];
        });
      },
      error: (error) => console.error("Subscription error:", error),
    });
    

    return () => subscription.unsubscribe();
  }, [chatRoomId]);

  const fetchMessages = async () => {
    if (!chatRoomId) return;
    try {
      //console.log("Fetching messages for ChatRoom ID:", chatRoomId);

      const response = await API.graphql(
        graphqlOperation(listRandomMessages, {
          filter: { randomChatRoomID: { eq: chatRoomId } },

          limit: 100, // Fetch all messages at once
        })
      );
     // console.log("Response listmessages:", JSON.stringify(response, null, 2));

      const fetchedMessages = response.data.listRandomMessages?.items || [];
     // console.log("Fetched messages:", fetchedMessages);

      // ✅ Set messages in state, ensuring correct order
      setMessages(fetchedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

 useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateRandomMessage, { chatroomID: chatRoomId }))
      .subscribe({
        next: ({ value }) => {
          const newMessage = value?.data?.onCreateMessage;
          if (newMessage) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
          }
        },
        error: (error) => console.error("❌ Subscription Error:", error),
      });
  
    return () => subscription.unsubscribe(); // Cleanup on unmount
  }, [chatRoomId]);
  

const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setViewableMessageIds((prevIds) => {
      const newIds = [...new Set([...prevIds, ...viewableItems.map((item) => item.item.id)])];
      return newIds.length !== prevIds.length ? newIds : prevIds; // Prevent unnecessary re-renders
    });
  }, []);

// ✅ Mark Messages as Read
  useEffect(() => {
    if (viewableMessageIds.length > 0) {
      markMessagesAsRead(viewableMessageIds);
    }
  }, [viewableMessageIds]);

  const markMessagesAsRead = async (messageIds: string[]) => {
    if (!currentUserId || messageIds.length === 0) return;
  
    try {
      // Step 1: Update message statuses to "READ"
      const unreadMessages = messages
        .filter((msg) => messageIds.includes(msg.id) && msg.userID !== currentUserId && msg.status !== "READ")
        .map((msg) => ({ id: msg.id, status: "READ" }));
  
      await Promise.all(
        unreadMessages.map(async (msg) => {
          await API.graphql({
            query:updateRandomMessage,
            variables: { input: msg },
          });
        })
      );

       
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  };
  
  const sendMessage = async () => {
    if (!message.trim() || !chatRoomId || !currentUserId) return;

    const textToSend = message;
    setMessage("");

    try {
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: textToSend,
        userID: currentUserId,
        randomChatRoomID: chatRoomId,
        status: "SENDING",
        createdAt: new Date().toISOString(),
      };
      setMessages((prevMessages) => [tempMessage, ...prevMessages]);

      const { data } = await API.graphql(
        graphqlOperation(createRandomMessage, {
          input: {
            content: textToSend,
            userID: currentUserId,
            randomChatRoomID: chatRoomId,
            status: "SENT",
          },
        })
      );
      const newMessage = data.createRandomMessage;

      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === tempMessage.id ? newMessage : msg))
      );

      await API.graphql(
        graphqlOperation(updateChatRoom, {
          input: {
            id: chatRoomId,
            chatRoomLastMessageId: newMessage.id,
          },
        })
      );

      await API.graphql(
        graphqlOperation(updateRandomMessage, {
          input: {
            id: newMessage.id,
            status: "DELIVERED",
          },
        })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send the message.");
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== tempMessage.id));
    }
  };
  if (!user) {
    return <Text style={styles.loadingText}>Loading user...</Text>;
  }



const backgroundColor=isDarkMode?'#1A1A1A':'#F5F5F5';
const BoxColor=isDarkMode?'#111':'#fff'
const textColor=isDarkMode?'#EAEAEA':'#333333'
  return (
    <KeyboardAvoidingView
      style={[styles.container,{backgroundColor:backgroundColor}]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OnlineMessage message={item} isCurrentUser={item.userID === currentUserId} />
        )}
        ListFooterComponent={
          <View style={[styles.profileContainer,{backgroundColor:BoxColor,marginVertical:30}]}>
          <Image source={{ uri: user?.imageUri }} style={styles.profileImage} />
          <Text style={[styles.username,{color:textColor}]}>{user?.name}</Text>
        </View>
  
        }
        inverted
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // Mark message as seen if 50% is visible
        }}
        
      />

      <View style={[styles.inputContainer,{backgroundColor: isDarkMode ? "#222222" : "#FFFFFF",}]}>
        <TextInput
          style={[styles.textInput,{color: isDarkMode ? "#FFFFFF" : "#333333",}]}
          placeholder="Type a message..."
          value={message}
          multiline
          onChangeText={setMessage}
          placeholderTextColor= {isDarkMode ? "#888888" : "#AAAAAA"}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  profileContainer: {
    width: 300,
    height: 250,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 60,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OnlineChatRoom;
