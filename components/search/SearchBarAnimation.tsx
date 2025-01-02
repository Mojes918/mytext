import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialIcons'; // You can use any icon library.

const SearchBarAnimation = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const animatedWidth = useRef(new Animated.Value(50)).current; // Initial width for the search bar.

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);

    Animated.timing(animatedWidth, {
      toValue: isSearchActive ? 50 : , // Shrink or expand width.
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.searchContainer, { width: animatedWidth }]}>
        {isSearchActive && (
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#999"
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    padding: 10,
  },
});

export default SearchBarAnimation;
