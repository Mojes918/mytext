import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
//import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Text} from "react-native";
import React from "react";
import { useColorScheme } from "@/components/useColorScheme";
import ChatRoomHeader from "@/components/ChatRoomHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
//import { ApolloProvider, ApolloClient, NormalizedCacheObject} from "@apollo/client";
//import setupApolloClient from "@/src/apolloClient";
import OnlineChatRoomHeader from "@/components/OnlineChatroomHeader";
import { InAppNotificationProvider } from "@/components/InAppNotification";
//import { registerForPushNotificationsAsync } from "@/utils/notification";
//import { API, Auth, graphqlOperation } from "aws-amplify";
//import { updateUser } from "@/src/graphql/mutations";


       


// ✅ Define the Param List
type RootStackParamList = {
  ChatRoomScreen: { id: string };
};

// ✅ Exporting ErrorBoundary for catching errors in Layout components
export { ErrorBoundary } from "expo-router";

// ✅ Define unstable settings for navigation
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// ✅ Main RootLayout Component
function RootLayout() {
  /*
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const [apolloError, setApolloError] = useState<Error | null>(null);*/
  /*

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
*/
/*
  useEffect(() => {
    const handlePushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        try {
          // ✅ Get authenticated user
          const user = await Auth.currentAuthenticatedUser();
          const userId = user?.attributes?.sub;
  
          if (!userId) {
            console.error("❌ No user ID found");
            return;
          }
  
          // ✅ Save Push Token to Backend using Amplify API
          const input = { id: userId, pushToken: token };
          const response = await API.graphql(graphqlOperation(updateUser, { input }));
  
          console.log("✅ Push token saved to backend!", response);
        } catch (err) {
          console.error("❌ Failed to save push token:", err);
        }
      }
    };
  
    handlePushNotifications();
  }, []);
*/

  // ✅ Setup Apollo Client Once on Mount
  /*
  useEffect(() => {
    const initializeApollo = async () => {
      try {
        console.log("🚀 Initializing Apollo Client...");
        const apolloClient = await setupApolloClient();
        setClient(apolloClient);
        console.log("✅ Apollo Client Ready!");
      } catch (err) {
        console.error("❌ Error setting up Apollo Client:", err);
        setApolloError(err as Error);
      }
    };

    initializeApollo();
  }, []);

  */
  
/*
  // ✅ Error Handling: Show Fallback UI Instead of Crashing
  if (error) {
    return <ErrorScreen message="Font Loading Error. Restart the App." />;
  }*/
 /*
  if (apolloError) {
    return <ErrorScreen message="Failed to connect to Apollo. Check logs for details." />;
  }

  // ✅ Show loading screen if fonts or Apollo Client is not ready
  if (!client) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }*/

  return <RootLayoutNav/>;
}
/*
// ✅ Fallback Error Screen
function ErrorScreen({ message }: { message: string }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}
*/
// ✅ RootLayoutNav Component
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
   
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="ChatRoomScreen"
              options={({ route }) => ({
                headerTitle: () => <ChatRoomHeader id={route.params?.ChatRoomId} />, // ✅ Fix: Correct param reference
              })}
            />
            <Stack.Screen
              name="OnlineChatRoom"
              options={({ route }) => ({
                headerTitle: () => <OnlineChatRoomHeader userId={route.params?.userId} />,
              })}
            />
            <Stack.Screen name="ImageViewScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ImagePreviewScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" options={{ headerShown: true }} />
            <Stack.Screen name="contactsScreen" options={{ headerShown: true, headerTitle: "My Contacts" }} />
          </Stack>
          <InAppNotificationProvider />
        </ThemeProvider>
      </GestureHandlerRootView>
   
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffcccc",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#cc0000",
  },
});

export default RootLayout;
