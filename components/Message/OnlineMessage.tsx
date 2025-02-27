import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Animated,
} from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { API, graphqlOperation } from "aws-amplify";
import { onUpdateMessage, onUpdateRandomMessage } from "@/src/graphql/subscriptions";

const OnlineMessage = ({ message, isCurrentUser }) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const translateX = useRef(new Animated.Value(0)).current; // ✅ Use useRef for animation

  // ✅ Ensure state updates when new messages arrive
  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  // ✅ Handle subscription updates properly
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateRandomMessage)
    ).subscribe({
      next: ({ value }) => {
        const updatedMessage = value.data.onUpdateRandomMessage;
        if (updatedMessage.id === message.id) {
          setCurrentMessage((prevMessage) => ({
            ...prevMessage,
            ...updatedMessage, // ✅ Merge all fields
          }));
        }
      },
      error: (error) => console.warn("Subscription error:", error),
    });

    return () => subscription.unsubscribe();
  }, [message.id]);

  // ✅ Prevent crashes due to invalid dates
  const formattedDate =
    message?.createdAt && !isNaN(new Date(message.createdAt).getTime())
      ? format(new Date(message.createdAt), "p")
      : "Now";

  const containerStyle = [
    styles.container,
    isCurrentUser ? styles.rightContainer : styles.leftContainer,
    {
      backgroundColor: isCurrentUser
        ? isDarkMode
          ? "#3953a3"
          : "#f949fc"
        : isDarkMode
        ? "#333"
        : "#fcfb92",
      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
      transform: [{ translateX }],
    },
  ];

  return (
    <PanGestureHandler
      onGestureEvent={Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
      )}
      onHandlerStateChange={(event) => {
        if (event.nativeEvent.state === State.END) {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      }}
      activeOffsetX={[-10, 10]}
    >
      <Animated.View style={containerStyle}>
        <View style={styles.row}>
          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageText,
                { color: isCurrentUser ? "white" : isDarkMode ? "white" : "black" },
              ]}
            >
              {currentMessage.content}
            </Text>
          </View>

          <View style={styles.timestampContainer}>
            <Text style={[styles.timestamp, { color: isCurrentUser ? "white" : "gray" }]}>
              {formattedDate}
            </Text>
            {isCurrentUser && currentMessage.status !== "SENT" && (
              <Ionicons
                name={currentMessage.status === "DELIVERED" ? "checkmark" : "checkmark-done"}
                size={20}
                color={currentMessage.status === "READ" ? "#a2f9fc" : "white"}
              />
            )}
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  rightContainer: {
    borderTopRightRadius: 0,
    alignSelf: "flex-end",
  },
  leftContainer: {
    borderTopLeftRadius: 0,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageContent: {
    flexShrink: 1,
  },
  messageText: {
    fontSize: 16,
  },
  timestampContainer: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 10,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
  },
});

export default OnlineMessage;
