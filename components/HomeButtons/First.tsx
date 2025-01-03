import React from 'react';
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
    const scale = interpolate(firstValue.value, [30, 130], [0, 1], Extrapolate.CLAMP);
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

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Third Icon */}
      <Animated.View style={[styles.contentContainer, thirdIcon, dynamicStyles.iconBackground]}>
        <Pressable style={styles.iconContainer} onPress={() => router.push('/OpenCamera')}>
          <Feather name="camera" size={24} color={isDarkMode ? '#ffffff' : '#fff'} />
        </Pressable>
      </Animated.View>

      {/* Second Icon */}
      <Animated.View style={[styles.contentContainer, secondIcon, dynamicStyles.iconBackground]}>
        <Pressable style={styles.iconContainer} onPress={() => router.push('/ScheduleMessage')}>
          <MaterialIcons name="schedule" size={24} color={isDarkMode ? '#ffffff' : '#fff'} />
        </Pressable>
      </Animated.View>

      {/* First Icon */}
      <Animated.View style={[styles.contentContainer, firstIcon, dynamicStyles.iconBackground]}>
        <Pressable style={styles.iconContainer} onPress={() => router.push('/addFriends')}>
          <AntDesign name="adduser" size={28} color={isDarkMode ? '#ffffff' : '#fff'} />
        </Pressable>
      </Animated.View>

      {/* Plus Icon */}
      <Pressable style={[styles.contentContainer]} onPress={handlePress}>
        <Animated.View style={[styles.iconContainer, plusIcon, dynamicStyles.iconBackground]}>
          <Feather name="plus" size={28} color={isDarkMode ? '#ffffff' : '#fff'} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    iconBackground: {
      backgroundColor: isDarkMode ? '#333' : '#3777f0',
    },
  });

const styles = StyleSheet.create({
  container: {
    //flex: 1,

  },
  contentContainer: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    borderRadius: 20,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius:25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default First;
