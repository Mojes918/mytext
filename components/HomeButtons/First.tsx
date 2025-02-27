import React, { useState } from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';  // Importing expo-image-picker

type Props = {};

const First = (props: Props) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const isOpen = useSharedValue(false);
  const progress = useDerivedValue(() => (isOpen.value ? withTiming(1) : withTiming(0)));

  const [image, setImage] = useState<string | null>(null); // State to store the selected image URI

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstValue.value = withTiming(30, config);
      secondValue.value = withDelay(50, withTiming(30, config));
      thirdValue.value = withDelay(100, withTiming(30, config));
    } else {
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
      thirdValue.value = withSpring(290);
    }
    isOpen.value = !isOpen.value;
  };

  
  

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(firstValue.value, [0, 30], [0, 1], Extrapolate.CLAMP);
    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(secondValue.value, [30, 210], [0, 1], Extrapolate.CLAMP);
    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(thirdValue.value, [30, 290], [0, 1], Extrapolate.CLAMP);
    return {
      bottom: thirdValue.value,
      transform: [{ scale: scale }],
    };
  });

  
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={[styles.container, dynamicStyles.container]}>

     
      <Animated.View style={[styles.contentContainer, firstIcon, dynamicStyles.iconBackground]}>
        <Pressable style={styles.iconContainer} onPress={() => router.push('/contactsScreen')}>
          <AntDesign name="adduser" size={25} color={isDarkMode ? '#ffffff' : '#fff'} />
        </Pressable>
      </Animated.View>

      
    </View>
  );
};

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#a5c4fa' : '#f5f5f5',
    },
    iconBackground: {
      backgroundColor: isDarkMode ? '#333' : '#256ffa',
    },
  });

const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default First;
