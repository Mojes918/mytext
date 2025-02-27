import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, useColorScheme } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "@/src/graphql/queries"; // Ensure you have a query for fetching user details

const OnlineChatRoomHeader = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<any>(null);
 const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark'
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.graphql(graphqlOperation(getUser, { id: userId }));
        setUser(response.data?.getUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) {
    return <Text>Loading user...</Text>;
  }
const textColor=isDarkMode?'#fff':'#000';
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: user.imageUri || "default_avatar_url" }} style={styles.avatar} />
      <Text style={[styles.username,{color:textColor}]}>{user.name || "Unknown User"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft:-20,
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnlineChatRoomHeader;
