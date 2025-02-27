import React from "react";
import { useColorScheme, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonMessageItem = ({ isSent }: { isSent: boolean }) => {
    const colorScheme = useColorScheme();
      const isDarkMode = colorScheme === 'dark';
     const backgroundcolor=isDarkMode?'#222':"lightgray";
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isSent ? "flex-end" : "flex-start",
        marginBottom: 10,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          maxWidth: "70%",
          padding: 12,
          borderRadius: 18,
          backgroundColor: backgroundcolor, // iMessage-like colors
          borderTopLeftRadius: isSent ? 18 : 5,
          borderTopRightRadius: isSent ? 5 : 18,
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
        }}
      >
        {/* Simulate text lines with different widths */}
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            height: 8,
            width: "80%",
            marginBottom: 6,
            borderRadius: 6,
          }}
          //shimmerColors={isSent ? ["#", "#555", "#555"] : ["#555", "#555", "#555"]}
        />
        
      </View>
    </View>
  );
};

export default SkeletonMessageItem;
