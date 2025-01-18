import { getUser, postsByUserID } from "@/src/graphql/queries";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { formatDistanceToNow } from "date-fns";


type Post = {
  id: string;
  userID: string;
  user?: {
    id: string;
    name: string;
    imageUri: string;
  };
  content: string;
  media: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  shares?: number;
};

const PostPage = () => {
  const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const router=useRouter();
  const textColor= isDarkMode ? 'white' : 'black'
  const [user,setUser]=useState();
  const backgroundColor = isDarkMode ? '#121212' : '#ffffff';
const [posts,setPosts]=useState();
  const route = useRoute();
  const {id } = route.params;
  
useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await API.graphql(graphqlOperation(getUser, { id }));
        const fetchedUser = result.data.getUser;
        
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", "Unable to fetch user data.");
      }
    };

    fetchUser();
  }, [id]);
   useEffect(() => {
      const fetchPosts = async () => {
        try {
         
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
    
       fetchPosts();
    }, []);

    
  const renderPost = ({ item }: { item: Post }) => {
      const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
  
      return (
        <View style={[styles.postContainer, { backgroundColor }]}>
          <View style={styles.postHeader}>
            <Image source={{ uri: item.user?.imageUri }} style={styles.profileImage} />
            <View style={{ gap: 2 }}>
              <Text style={[styles.userName, { color: textColor }]}>{item.user?.name}</Text>
              <Text style={[styles.time]}>{timeAgo}</Text>
            </View>
          </View>
          <View style={styles.postFooter}>
            <Text style={[styles.caption, { color: textColor }]}>{item.content}</Text>
          </View>
          {item.media && <Image source={{ uri: item.media }} style={styles.postImage} />}
          <View style={{ marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <View style={{ alignItems: "center" }}>
                  <AntDesign name="heart" size={20} color={textColor} />
                  <Text style={[styles.likes]}>{item.likes || 0}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons name="comment-text-outline" size={20} color={textColor} />
                  <Text style={{ color: "#777" }}>{item.comments || 0}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Feather name="send" size={20} color={textColor} />
                  <Text style={{ color: "#777" }}>{item.shares || 0}</Text>
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Octicons name="bookmark" size={20} color={textColor} />
              </View>
            </View>
          </View>
        </View>
      );
    };
  
  return (
    <View style={[styles.container,{backgroundColor:backgroundColor}]}>
      
      {/* User Profile */}
      
      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    //paddingHorizontal:10,
  },
  profileContainer: {
    height:100,
    width:"auto",
    padding:10,
    gap:10
  },
  mainProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  mainUserName: {
    fontSize: 15,
    fontWeight: "bold",
    //marginTop: 10,
  },
  titleName: {
    fontSize: 16,
    fontWeight: "bold",
    //marginTop: 10,
  },
  postsList: {
    marginTop: 10,
  },
  postContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 20,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postImage: {
    width: "95%",
    alignSelf:"center",
    borderRadius:10,
    marginBottom:10,
    height: 300,
    resizeMode: "cover",
  },
  postFooter: {
    padding: 10,
  },
  likes: {
    color:"#777",
    marginBottom: 5,
  },
  caption: {
    marginBottom: 5,
    
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});

export default PostPage;
