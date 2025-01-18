import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "@/src/graphql/queries";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

const defaultImage = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

const UserList = () => {
    const route=useRoute();
    const router=useRouter();
  const { users, title } = route.params || null;
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("Route Params:", route.params);
  }, []);
  
  useEffect(() => {
    let parsedUsers = [];
    try {
      parsedUsers = JSON.parse(users); // Parse the string back into an array
    } catch (error) {
      console.error("Failed to parse 'users' parameter:", error);
    }
  
    if (!Array.isArray(parsedUsers)) {
      console.error("Invalid 'users' parameter:", parsedUsers);
      setLoading(false);
      return;
    }
  
    const fetchUsers = async () => {
      try {
        const userDetails = await Promise.all(
          parsedUsers.map(async (follow) => {
            const result = await API.graphql(graphqlOperation(getUser, { id: follow.followingID }));
            return result.data.getUser;
          })
        );
        setUserList(userDetails);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [users]);
  
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={()=>router.push({pathname:"/UserProfile",params:{id:item?.id}})}>
      <Image
        source={{ uri: item.imageUri || defaultImage }}
        style={styles.userImage}
      />
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={userList}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  list: { paddingBottom: 16 },
  userItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  userImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 16 },
});

export default UserList;
