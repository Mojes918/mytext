import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Modal,
  useColorScheme,
  
} from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { postsByUserID, getUser } from "@/src/graphql/queries";

import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

type User = {
  id: string;
  name: string;
  phonenumber: string;
  status: string;
  imageUri?: string;
  backgroundImageUri?: string;
};
const UserProfile = () => {
  const gridSize = Dimensions.get("window").width / 3 - 2;
  const [user, setUser] = useState<User|null>(null);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // Track the selected image for full screen
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router=useRouter();
const route=useRoute();
const {id}=route.params||null;
  const textColor = isDarkMode ? "white" : "black";
  const backgroundColor = isDarkMode ? "#121212" : "#ffffff";

  // Fetch User Info
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const result = await API.graphql(graphqlOperation(getUser, { id }));
          const fetchedUser = result.data.getUser;
          //console.log("Fetched User:", JSON.stringify(fetchedUser, null, 2));
          // Calculate followers and following counts
          const followersCount = fetchedUser.followers?.items.length || 0;
          const followingCount = fetchedUser.following?.items.length || 0;
  
          setUser({ ...fetchedUser, followersCount, followingCount });
        } catch (error) {
          console.error("Error fetching user:", error);
          Alert.alert("Error", "Unable to fetch user data.");
        }
      };
  
      fetchUser();
    }, [id]);

  // Fetch Posts of the User
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!user?.id) return;
        const result = await API.graphql(graphqlOperation(postsByUserID, { userID: id }));
        const fetchedPosts = result?.data?.postsByUserID?.items||[];
        if (!Array.isArray(fetchedPosts)) {
          throw new Error("Fetched posts is not an array");
        }
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        Alert.alert("Error", "Unable to fetch posts.");
      }
    };
  
    if (user?.id) fetchPosts();
  }, [user]);
  const handleFollow = (id) => {
    console.log(`Follow user with ID: ${id}`);
    // Implement follow functionality
  };
  

 
  const renderPost = ({ item }) => (
    <TouchableWithoutFeedback onPress={() =>router.push({pathname:"/Post page",params:{id:id}})}>
      <Image
        source={{ uri: item.media }}
        style={[styles.gridImage, { width: gridSize, height: gridSize }]}
      />
    </TouchableWithoutFeedback>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: user?.backgroundImageUri || user?.imageUri || defaultImage,
          }}
          style={styles.profileImage}
        />
       
        <Text style={[styles.userName, { color: textColor }]}>{user?.name}</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statsItem} 
            onPress={() => {
              const followersList = user?.followers?.items || [];
              router.push({
                pathname: '/UserfollowList',
                params: { users: JSON.stringify(followersList), title: "Followers" },
              });
            }}
          >
            <Text style={[styles.statsNumber, { color: textColor }]}>
              {user?.followersCount || 0}
            </Text>
            <Text style={styles.statsLabel}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statsItem} 
            onPress={() => {
              const followingList = user?.following?.items || [];
              router.push({
                pathname: '/UserfollowList',
                params: { users: JSON.stringify(followingList), title: "Following" },
              });
            }}
          >
            <Text style={[styles.statsNumber, { color: textColor }]}>
              {user?.followingCount || 0}
            </Text>
            <Text style={styles.statsLabel}>Following</Text>
          </TouchableOpacity>
          
        </View>
        <TouchableOpacity 
        style={styles.editProfileButton} 
        onPress={() => handleFollow(id)}
        >
          <Text style={[ { color: textColor }]}>Follow</Text>
        </TouchableOpacity>
        
      </View>

      {/* Posts Section */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContainer}
        ListEmptyComponent={<Text style={{marginLeft:150,color:textColor}}>No Posts yet</Text>}
        ListHeaderComponent={<Text style={[styles.headerpost, { color: textColor }]}>Posts {posts.length}</Text>}
      />
     
      {/* Full-Screen Modal */}
      {selectedImage && (
        <Modal transparent={true} animationType="fade" onRequestClose={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeArea} onPress={() => setSelectedImage(null)} />
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    position:"relative"
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  statsItem: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statsNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 14,
    color: "#777",
  },
  editProfileButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  postsContainer: {
    paddingHorizontal: 1,
  },
  gridImage: {
    margin: 1,
    resizeMode: "cover",
  },
  headerpost: {
    fontSize: 20,
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullScreenImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  closeArea: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  previewImage: { width: 100, height: 100, borderRadius: 50, marginVertical: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around" },
});

export default UserProfile;
