import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { updateUser } from "@/src/graphql/mutations";
import { getUser } from "../../src/graphql/queries";
import { onUpdateUser } from "@/src/graphql/subscriptions";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Define color themes
const colorScheme = {
  dark: {
    background: "#121212",
    card: "#121212",
    textPrimary: "#FFFFFF",
    textSecondary: "#AAAAAA",
    border: "#121212",
    icon: "#DDDDDD",
  },
  light: {
    background: "#FFFFFF",
    card: "#FFFFFF",
    textPrimary: "#121212",
    textSecondary: "#555555",
    border: "#fff",
    icon: "#444444",
  },
};
// Define User Type
type User = {
  id: string;
  name: string;
  phonenumber: string;
  status: string;
  imageUri?: string;
  backgroundImageUri?: string;
};
export default function Settings() {
  const currentTheme = useColorScheme() || "dark";
  const theme = colorScheme[currentTheme];
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  // Logout Function
  const LogOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      Alert.alert("Error", "Unable to log out. Please try again.");
    }
  };

  // Fetch and Subscribe to User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;

        const result = await API.graphql(
          graphqlOperation(getUser, { id: userId })
        );

        const fetchedUser = result.data.getUser as User;
        setUser(fetchedUser);
        setProfileImage(fetchedUser.imageUri || null);
        setBackgroundImage(fetchedUser.backgroundImageUri || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", "Unable to fetch user data.");
      }
    };

    fetchUser();

    const subscription = API.graphql(
      graphqlOperation(onUpdateUser)
    ).subscribe({
      next: ({ value }) => {
        const updatedUser = value.data.onUpdateUser as User;
        setUser(updatedUser);
        setProfileImage(updatedUser.imageUri || null);
        setBackgroundImage(updatedUser.backgroundImageUri || null);
      },
      error: (error) => {
        console.error("Subscription error:", error);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update Image
  const pickImage = async (type: "profile" | "background") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [4, 3] : [16, 9],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      try {
        setIsLoading(true);
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;

        const input =
          type === "profile"
            ? { id: userId, imageUri: selectedImage }
            : { id: userId, backgroundImageUri: selectedImage };

        await API.graphql(graphqlOperation(updateUser, { input }));
        type === "profile"
          ? setProfileImage(selectedImage)
          : setBackgroundImage(selectedImage);
      } catch (error) {
        console.error("Error updating image:", error);
        Alert.alert("Error", "Unable to update image.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Update User Data from Params
  useEffect(() => {
    const params = router.params as Record<string, string | undefined>;
    if (params?.updatedName || params?.updatedPhone || params?.updatedAbout) {
      setUser((prevUser) => ({
        ...prevUser!,
        name: params.updatedName || prevUser?.name || "",
        phonenumber: params.updatedPhone || prevUser?.phonenumber || "",
        status: params.updatedAbout || prevUser?.status || "",
      }));
    }
  }, [router.params]);

  
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Image Section */}
      <View style={[styles.profileContainer, { backgroundColor: theme.card }]}>
        <ImageBackground
          source={{
            uri:
              backgroundImage ||
              profileImage ||
              "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <TouchableOpacity
            style={styles.cameraIconBackground}
            onPress={() => pickImage("background")}
          >
            <Icon name="camera" size={20} color="white" />
          </TouchableOpacity>

          <View style={styles.overlayContainer}>
            <View>
              <Image
                source={{
                  uri:
                    profileImage ||
                    "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
                }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.cameraIconProfile}
                onPress={() => pickImage("profile")}
              >
                <Icon name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.profileName, { color: theme.textPrimary }]}>
              {user?.name || "User Name"}
            </Text>
            <Text style={[styles.profileNumber, { color: theme.textPrimary }]}>
              {user?.phonenumber || "+1234567890"}
            </Text>
          </View>
        </ImageBackground>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <TextInput
            style={[styles.aboutInput, { color: theme.textPrimary }]}
            placeholder="Add a brief description about yourself"
            placeholderTextColor={theme.textSecondary}
            value={user?.status || ""}
            editable={false} // Not editable here; can edit on the next screen
          />
        </View>

        {/* Loading indicator */}
        {isLoading && <ActivityIndicator size="large" color={theme.icon} />}

        {/* Edit Button */}
        <Pressable
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: '/EditProfile',
              params: {
                name: user?.name || '',
                phone: user?.phonenumber || '',
                about: user?.status || '',
              },
            })
          }
        >
          <Text style={[styles.editButtonText,{color:theme.textPrimary}]}>Edit Profile</Text>
        </Pressable>

      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Pressable style={styles.logoutButton} onPress={LogOut}>
          <Text style={[styles.logoutButtonText,{color:theme.textPrimary}]}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileContainer: { width: "100%", height: 300 },
  imageBackground: { width: "100%", height: "100%", justifyContent: "flex-end" },
  overlayContainer: { alignItems: "center", marginBottom: -100 },
  profileImage: { height: 120, width: 120, borderRadius: 60, borderWidth: 2, borderColor: "white", marginBottom: 10 },
  cameraIconProfile: { position: "absolute", bottom: 0, right: 10, backgroundColor: "#444", borderRadius: 15, padding: 5 },
  cameraIconBackground: { position: "absolute", top: 10, right: 10, backgroundColor: "#444", borderRadius: 20, padding: 8 },
  profileName: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  profileNumber: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 5 },
  aboutContainer: { paddingHorizontal: 20, marginTop: 100 },
  aboutInput: { fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10 },
  editButton: {
    marginTop: 20,
    borderColor:"gray",
    borderWidth:2,
    padding: 10,
    width:200,
    alignItems: "center",
    alignSelf:"center",
    justifyContent:"center",
    borderRadius: 5,
  },
  editButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  logoutContainer: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 20, paddingBottom: 30 },
  logoutButton: { borderWidth:2,borderColor:"gray", padding: 15, alignItems: "center", borderRadius: 5 },
  logoutButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
