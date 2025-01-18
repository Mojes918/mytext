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
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { commentsByPostID, getUser, postsByUserID ,likesByPostID,lovesByPostID} from "@/src/graphql/queries";
import { onCreatePost } from "@/src/graphql/subscriptions";
import CommentModal from "../CommentModal";

// Import mutations for like and love
import { createLike, createLove, deleteLike, deleteLove } from "@/src/graphql/mutations";

type User = {
  id: string;
  name: string;
  phonenumber: string;
  status: string;
  imageUri?: string;
  backgroundImageUri?: string;
};

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
  loves?: number;
  shares?: number;
};

const Social = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  const textColor = isDarkMode ? "white" : "black";
  const backgroundColor = isDarkMode ? "#121212" : "#ffffff";
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [lovedPosts, setLovedPosts] = useState<{ [key: string]: boolean }>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [Postid, setPostid] = useState(false);

  const isPostOlderThan5Minutes = (createdAt: string) => {
    const postTime = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - postTime.getTime()) / (1000 * 60);
    return diffInMinutes > 5;
  };

  // Fetch user and posts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;
  
        const userResult = await API.graphql(graphqlOperation(getUser, { id: userId }));
        const fetchedUser = userResult.data.getUser;
        setUser(fetchedUser);
  
        const followingIds = fetchedUser.following?.items.map((follow) => follow.followingID) || [];
        const allUserIds = [userId, ...followingIds];
  
        const promises = allUserIds.map((id) =>
          API.graphql(graphqlOperation(postsByUserID, { userID: id }))
        );
        const results = await Promise.all(promises);
  
        const allPosts = results.flatMap((result) => result.data.postsByUserID.items || []);
        const filteredPosts = allPosts.filter(
          (post) => !isPostOlderThan5Minutes(post.createdAt) || post.userID !== userId
        );
        const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setPosts(sortedPosts);
  
        // Fetch like and love status for each post
       // Fetch like and love status for each post
const likeStatusPromises = sortedPosts.map(async (post) => {
  const { data: likeData } = await API.graphql(graphqlOperation(likesByPostID, { postID: post.id }));
  const isLiked = likeData?.listLikesByPostID?.items.some((like) => like.userID === userId);
  const likesCount = likeData?.listLikesByPostID?.items?.length || 0; // Correct the reference to listLikesByPostID
  setLikedPosts((prev) => ({ ...prev, [post.id]: { isLiked, likesCount } }));

  const { data: loveData } = await API.graphql(graphqlOperation(lovesByPostID, { postID: post.id }));
  const isLoved = loveData?.listLovesByPostID?.items.some((love) => love.userID === userId);
  const lovesCount = loveData?.listLovesByPostID?.items?.length || 0; // Correct the reference to listLovesByPostID
  setLovedPosts((prev) => ({ ...prev, [post.id]: { isLoved, lovesCount } }));
});

  
        // Wait for all like/love status to be fetched
        await Promise.all(likeStatusPromises);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Unable to fetch posts.");
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreatePost)).subscribe({
      next: ({ value }) => {
        const newPost = value.data.onCreatePost;

        if (
          newPost.userID === user?.id ||
          user?.following?.items.some((follow) => follow.followingID === newPost.userID)
        ) {
          setPosts((prevPosts) => [newPost, ...prevPosts]);

          if (newPost.userID === user?.id) {
            setTimeout(() => {
              setPosts((prevPosts) => prevPosts.filter((post) => post.id !== newPost.id));
            }, 300000);
          }
        }
      },
      error: (error) => console.error("Subscription error:", error),
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const fetchComments = async (postID) => {
    try {
      const result = await API.graphql(graphqlOperation(commentsByPostID, { postID }));
      const rawComments = result.data.commentsByPostID.items || [];
      const formattedComments = rawComments.map((comment) => ({
        id: comment.id,
        userName: comment.user?.name || "Unknown",
        userImage: comment.user?.imageUri || "default-image-uri",
        text: comment.content,
        createdAt: comment.createdAt,
      }));
      return formattedComments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  const handleOpenComments = async (postID: string) => {
    const fetchedComments = await fetchComments(postID);
    setComments(fetchedComments);
    setPostid(postID);
    setModalVisible(true);
  };
  const handleAddComment = (newComment) => {
    setComments((prev) => [...prev, newComment]); // Add to the local comments array
  };

  // Handle like toggle
const handleLikeToggle = async (postID: string) => {
  try {
    const userId = user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const { data } = await API.graphql(graphqlOperation(likesByPostID, { postID }));
    const like = data?.likesByPostID?.items.find((like) => like.userID === userId);

    if (like) {
      await API.graphql(graphqlOperation(deleteLike, { input: { id: like.id } }));

      setLikedPosts((prev) => {
        const updatedLikes = { ...prev };
        delete updatedLikes[postID]; // Remove like for this post
        return updatedLikes;
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postID
            ? { ...post, likes: (post.likes || 0) - 1 }
            : post
        )
      );
    } else {
      const input = { postID, userID: userId };
      await API.graphql(graphqlOperation(createLike, { input }));

      setLikedPosts((prev) => ({ ...prev, [postID]: { isLiked: true, likesCount: (prev[postID]?.likesCount || 0) + 1 } }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postID
            ? { ...post, likes: (post.likes || 0) + 1 }
            : post
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like", error);
  }
};

// Handle love toggle
const handleLoveToggle = async (postID: string) => {
  try {
    const userId = user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const { data } = await API.graphql(graphqlOperation(lovesByPostID, { postID }));
    const love = data?.lovesByPostID?.items.find((love) => love.userID === userId);

    if (love) {
      await API.graphql(graphqlOperation(deleteLove, { input: { id: love.id } }));

      setLovedPosts((prev) => {
        const updatedLoves = { ...prev };
        delete updatedLoves[postID]; // Remove love for this post
        return updatedLoves;
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postID
            ? { ...post, loves: (post.loves || 0) - 1 }
            : post
        )
      );
    } else {
      const input = { postID, userID: userId };
      await API.graphql(graphqlOperation(createLove, { input }));

      setLovedPosts((prev) => ({ ...prev, [postID]: { isLoved: true, lovesCount: (prev[postID]?.lovesCount || 0) + 1 } }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postID
            ? { ...post, loves: (post.loves || 0) + 1 }
            : post
        )
      );
    }
  } catch (error) {
    console.error("Error toggling love", error);
  }
};

  

const renderPost = ({ item }: { item: Post }) => {
  const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
  const { isLiked, likesCount } = likedPosts[item.id] || { isLiked: false, likesCount: 0 };
  const { isLoved, lovesCount } = lovedPosts[item.id] || { isLoved: false, lovesCount: 0 };

  return (
    <View style={[styles.postContainer, { backgroundColor }]} key={item.id}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user?.imageUri }} style={styles.profileImage} />
        <View style={{ gap: 2 }}>
          <Text style={[styles.userName, { color: textColor }]}>{item.user?.name}</Text>
          <Text style={[styles.time]}>{timeAgo}</Text>
        </View>
      </View>

      {item.media && <Image source={{ uri: item.media }} style={styles.postImage} />}
      <View style={{ marginHorizontal: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity onPress={() => handleLikeToggle(item.id)}>
              <AntDesign
                name={isLiked ? "heart" : "hearto"}
                size={22}
                color={isLiked ? "red" : textColor}
              />
              <Text style={[styles.likes]}>{likesCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLoveToggle(item.id)} style={{ alignItems: "center" }}>
              <SimpleLineIcons name={isLoved ? "like" : "like"} size={22} color={isLoved ? "blue" : textColor} />
              <Text style={[styles.likes]}>{lovesCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => handleOpenComments(item.id)}
            >
              <MaterialCommunityIcons name="comment-text-outline" size={24} color={textColor} />
              <Text style={{ color: "#777" }}>{item.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.postFooter}>
        <Text style={[styles.caption, { color: textColor }]}>{item.content}</Text>
      </View>
    </View>
  );
};


  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.profileContainer, { backgroundColor }]}>
            <View style={styles.profileHeader}>
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/UserSocialProfile", params: { id: user?.id } })
                }
              >
                <Image
                  source={{ uri: user?.backgroundImageUri || user?.imageUri }}
                  style={styles.mainProfileImage}
                />
              </TouchableOpacity>
              <Text style={[styles.titleName, { color: textColor }]}>MySocial</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/AddNewPosts", params: { id: user?.id } })
                  }
                >
                  <Ionicons name="add-sharp" size={30} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/SearchProfile", params: { id: user?.id } })
                  }
                >
                  <Feather name="search" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: textColor }}>No posts yet. Follow more users to see their posts!</Text>
          </View>
        }
      />
      <CommentModal
        postID={Postid}
        user={user}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        comments={comments}
        onAddComment={handleAddComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileContainer: { height: 100, padding: 10, gap: 10 },
  profileHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  mainProfileImage: { width: 60, height: 60, borderRadius: 50 },
  titleName: { fontSize: 16, fontWeight: "bold" },
  headerActions: { flexDirection: "row", gap: 20, alignItems: "center" },
  postContainer: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#ddd", paddingBottom: 20 },
  postHeader: { flexDirection: "row", alignItems: "center", padding: 10 },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: "bold" },
  postImage: { width: "100%", alignSelf: "center", marginBottom: 10, height: 300, resizeMode: "cover" },
  postFooter: { padding: 10 },
  likes: { color: "#777", marginBottom: 5 },
  caption: { marginBottom: 5, fontSize: 16 },
  time: { fontSize: 12, color: "#888" },
});

export default Social;
