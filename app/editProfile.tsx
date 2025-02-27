import React, { useState } from "react";
import { 
  View, Text, TextInput, Pressable, 
  StyleSheet, Alert, useColorScheme 
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { UPDATE_USER, GET_USER } from "@/src/graphql/operations";
import { Auth } from "aws-amplify";
import { useApolloClient } from "@apollo/client";

export default function EditProfile() {
  const route = useRoute();
  const router = useRouter();
  const client = useApolloClient(); // Apollo Client instance

  const {name, phone, about } = route.params || {};
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const textColor = isDarkMode ? "white" : "black";
  const backgroundColor = isDarkMode ? "#121212" : "#fff";

  const [editedName, setEditedName] = useState(name || "");
  const [editedPhone, setEditedPhone] = useState(phone || "");
  const [editedAbout, setEditedAbout] = useState(about || "");
  const [isSaving, setIsSaving] = useState(false);

  // Apollo mutation
  const [updateUser, { loading }] = useMutation(UPDATE_USER);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const userId = authenticatedUser.attributes.sub;

      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        setIsSaving(false);
        return;
      }

      if (!editedName.trim() || !editedAbout.trim()) {
        Alert.alert("Error", "Name and About fields cannot be empty.");
        setIsSaving(false);
        return;
      }

      const updatedUser = {
        id: userId,
        name: editedName.trim(),
        status: editedAbout.trim(),
      };

      const { data } = await updateUser({
        variables: { input: updatedUser },
      });

      if (data?.updateUser) {
        // Reflect changes in Apollo Cache
        client.cache.writeQuery({
          query: GET_USER,
          variables: { id: userId },
          data: { getUser: { ...data.updateUser } },
        });

       // Alert.alert("Success", "Profile updated successfully.");

        // Navigate back with updated data
        router.replace({
          pathname: "/(tabs)/settings",
          params: {
            updatedName: editedName,
            updatedPhone: editedPhone,
            updatedAbout: editedAbout,
          },
        });
      }
    } catch (error) {
      //console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Edit Profile</Text>

      <Text style={[styles.label, { color: textColor }]}>Name</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={editedName}
        onChangeText={setEditedName}
        placeholder="Enter your name"
        placeholderTextColor="gray"
      />

      <Text style={[styles.label, { color: textColor }]}>Phone Number</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={editedPhone}
        onChangeText={setEditedPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        placeholderTextColor="gray"
      />

      <Text style={[styles.label, { color: textColor }]}>About</Text>
      <TextInput
        style={[styles.input, styles.aboutInput, { color: textColor }]}
        value={editedAbout}
        onChangeText={setEditedAbout}
        placeholder="About yourself"
        placeholderTextColor="gray"
        multiline
      />

      <Pressable style={styles.saveButton} onPress={handleSave} disabled={isSaving || loading}>
        <Text style={styles.saveButtonText}>{isSaving || loading ? "Saving..." : "Save"}</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={[styles.cancelButtonText, { color: textColor }]}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
  aboutInput: { height: 100, textAlignVertical: "top" },
  saveButton: { backgroundColor: "#4CAF50", padding: 15, alignItems: "center", borderRadius: 5 },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: { borderWidth: 1, borderColor: "#333", padding: 15, alignItems: "center", borderRadius: 5, marginTop: 10 },
  cancelButtonText: { fontSize: 16, fontWeight: "bold" },
});
