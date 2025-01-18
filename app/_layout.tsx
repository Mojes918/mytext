import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useColorScheme } from '@/components/useColorScheme'; // Custom hook to fetch the color scheme
import ChatRoomHeader from '@/components/ChatRoomHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
// Define the Param List
type RootStackParamList = {
  ChatRoomScreen: { id: string }; // Define the `id` parameter
  // Add other routes here
};

// Exporting ErrorBoundary for catching errors in Layout components
export {
  ErrorBoundary, // Catch any errors thrown by the Layout component.
} from 'expo-router';

// Define unstable settings for navigation
export const unstable_settings = {
  initialRouteName: '(tabs)/_layout', // Ensures that reloading on `/modal` keeps a back button present.
};

// Main RootLayout Component
function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Roboto: require('../assets/fonts/Roboto-Bold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false); // Hide splash screen after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (isSplashVisible || !loaded) {
    return <SplashScreen />;
  }

  return <RootLayoutNav />;
}

export default RootLayout;

// RootLayoutNav Component
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    // When the color scheme is determined, we set the theme as loaded
    setIsThemeLoaded(true);
  }, [colorScheme]);

  if (!isThemeLoaded) {
    // Show loading until theme is determined to avoid flickering
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/two" options={{ headerShown: true, headerTitle: 'Stories' }} />
        <Stack.Screen name="(tabs)/settings" options={{ headerShown: true, headerTitle: 'Settings' }} />
        
        {/* Use the Param List for route props */}
        <Stack.Screen
          name="ChatRoomScreen"
          options={({ route }: NativeStackScreenProps<RootStackParamList, 'ChatRoomScreen'>) => ({
            headerTitle: () => <ChatRoomHeader id={route.params.id} />, // Use the id directly
           // headerBackVisible:false
          })}
        />
        <Stack.Screen name="SearchProfile" options={{ headerShown: true,headerTitle:"Search" }} />
        <Stack.Screen name="AddNewPosts" options={{ headerShown: true,headerTitle:"Add Post" }} />
        <Stack.Screen name="UserSocialProfile" options={{ headerShown: true ,headerTitle:"My Profile"}} />
        <Stack.Screen name="ProfileScreen" options={{ headerShown: true }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: true }} />
        <Stack.Screen name="SelectContact.tsx" options={{ headerShown: true }} />
        <Stack.Screen name="contactsScreen" options={{ headerShown: true }} />
        <Stack.Screen name="ScheduleMessage" options={{ headerShown: true }} />
        <Stack.Screen name="OpenCamera" options={{ headerShown: true }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// SplashScreen Component
const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../assets/images/splashLogo.jpeg')}
        style={styles.logo}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5288FF', // Ensure splash screen has a background color that matches your theme
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
