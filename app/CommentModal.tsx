import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  useColorScheme,
  Alert,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { createComment } from "@/src/graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { ActivityIndicator } from "react-native";
import { formatDistanceToNow } from "date-fns";

const CommentModal = ({ isVisible, onClose, comments, postID, user,onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const backgroundColor = isDarkMode ? "#121212" : "#ffffff";
  const textColor = isDarkMode ? "white" : "black";
  const [loading, setLoading] = useState(false);

  
  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }
  const renderComment = ({ item }) => {
    const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

    return (
      <View style={styles.commentContainer}>
        <Image source={{ uri: item.userImage }} style={styles.commentProfileImage} />
        <View style={styles.commentContent}>
           
          <Text style={[styles.commentUserName, { color: textColor }]}>{item.userName}</Text>
         
        
          <Text style={{ color: textColor }}>{item.text}</Text>
        </View>
        
       
        <TouchableOpacity style={{alignItems:"center",gap:5}}> 
        <Text style={{ color: textColor,fontSize:12 }}>{timeAgo}</Text>
          <AntDesign name="hearto" size={18} color="#777" />
          
        </TouchableOpacity>
      </View>

    );
    
  };
  

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Comment cannot be empty.");
      return;
    }
  
    try {
      const newCommentInput = {
        postID,
        userID: user.id,
        content: newComment,
      };
      const result = await API.graphql(graphqlOperation(createComment, { input: newCommentInput }));
      const addedComment = result.data.createComment;
  
      const updatedComment = {
        id: addedComment.id,
        userName: user.name,
        userImage: user.imageUri,
        text: addedComment.content,
      };
  
      onAddComment(updatedComment); // Notify parent to update its state
      setNewComment("");
      Alert.alert("Success", "Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Unable to add comment.");
    }
  };
  
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={[styles.modalContainer, { backgroundColor }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: textColor }]}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id || item.text}
          contentContainerStyle={styles.commentList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
            <MaterialCommunityIcons name="send-circle" size={36} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
  },
});
