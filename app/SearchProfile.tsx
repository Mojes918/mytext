import { createFollow, deleteFollow } from "@/src/graphql/mutations";
import { listFollows, listUsers } from "@/src/graphql/queries";
import { useRoute } from "@react-navigation/native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  useColorScheme,
} from "react-native";
const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';
const SearchFriends = () => {
    const route=useRoute();
    const router=useRouter();
    const {id}=route.params||null;
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [followStatus, setFollowStatus] = useState({}); // Track follow/unfollow state
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const textColor = isDarkMode ? "white" : "black";
  const backgroundColor = isDarkMode ? "#121212" : "#ffffff";
const suggestion=isDarkMode?"#111":"#f9f9f9"
useEffect(() => {
  const fetchUsersAndFollowings = async () => {
    try {
      // Fetch all users
      const userResult = await API.graphql(
        graphqlOperation(listUsers, { limit: 20 })
      );
      const fetchedUsers = userResult.data.listUsers.items;
        
        

      // Fetch follow relationships for the current user
      const followResult = await API.graphql(
        graphqlOperation(listFollows, {
          filter: { followerID: { eq: id } },
        })
      );
      const followedUsers = followResult.data.listFollows.items.map(
        (follow) => follow.followingID
      );

      // Filter out already followed users
      const unfollowedUsers = fetchedUsers.filter(
        (user) => !followedUsers.includes(user.id)
      );

      setSuggestions(unfollowedUsers);
      setFilteredSuggestions(unfollowedUsers);

      // Initialize follow status
      const status = {};
      unfollowedUsers.forEach((user) => {
        status[user.id] = false; // Set as not followed
      });
      setFollowStatus(status);
    } catch (error) {
      console.error("Error fetching users or follow data:", error);
      Alert.alert("Error", "Unable to fetch data.");
    }
  };

  fetchUsersAndFollowings();
}, []);



  // Filter suggestions based on search query
  useEffect(() => {
    
    if (searchQuery.trim() === "") {
      setFilteredSuggestions(suggestions);
    } else {
      const filtered = suggestions.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [searchQuery, suggestions]);

  // Follow a user
  const toggleFollow = async (followedUserID) => {
    try {
      if (followStatus[followedUserID]) {
        // Unfollow user: Fetch the follow relationship ID first
        const authUSer=await Auth.currentAuthenticatedUser();
        const userId=authUSer?.attributes.sub;
        const result = await API.graphql(
          graphqlOperation(listFollows, {
            filter: {
              followerID: { eq: userId },
              followingID: { eq: followedUserID },
            },
          })
        );
  
        const followData = result.data.listFollows.items[0];
        if (!followData) {
          Alert.alert("Error", "Follow relationship not found.");
          return;
        }
  
        await API.graphql(
          graphqlOperation(deleteFollow, { input: { id: followData.id } })
        );
        Alert.alert("Success", "You have unfollowed this user!");
      } else {
        // Follow user
        const authUSer=await Auth.currentAuthenticatedUser();
        const userId=authUSer?.attributes.sub;
        const followData = {
          followerID: userId,
          followingID: followedUserID,
        };
  
        await API.graphql(graphqlOperation(createFollow, { input: followData }));
        Alert.alert("Success", "You are now following this user!");
      }
  
      // Update the follow status
      setFollowStatus((prev) => ({
        ...prev,
        [followedUserID]: !prev[followedUserID],
      }));
    } catch (error) {
      console.error("Error toggling follow status:", error);
      Alert.alert("Error", "Unable to update follow status.");
    }
  };
  
  // Remove a suggestion
  const handleRemoveSuggestion = (id) => {
    setSuggestions((prev) => prev.filter((user) => user.id !== id));
  };

  // Render each suggestion
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity style={[styles.suggestionItem,{backgroundColor:suggestion}]} onPress={()=>router.push({pathname:"/UserProfile",params:{id:item?.id}})}>
        
      <Image source={{ uri: item.backgroundImageUri||item.imageUri|| defaultImage}} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={[styles.username,{color:textColor}]}>{item.name}</Text>
        <Text style={[styles.name,{color:textColor}]}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleRemoveSuggestion(item.id)}
      >
        <Text style={[styles.followText,{color:"black"}]}>cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={followStatus[item.id] ? styles.unfollowButton : styles.followButton}
        onPress={() => toggleFollow(item.id)}
      >
        <Text style={styles.followText}>
          {followStatus[item.id] ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container,{backgroundColor:backgroundColor}]}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Suggestions List */}
      <FlatList
        data={filteredSuggestions}
        renderItem={renderSuggestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.suggestionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  suggestionsList: {
    paddingBottom: 20,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
  },
  name: {
    fontSize: 12,
    color: "#666",
  },
  followButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin:5
  },
  unfollowButton: {
    backgroundColor: "#666",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin:5
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin:5
  },
  followText: {
    color: "#fff",
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeText: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SearchFriends;
