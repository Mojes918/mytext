import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { updateUser } from "@/src/graphql/mutations";
import { useRouter } from 'expo-router'; 
export default function EditProfile() {
  const route = useRoute();
  const navigation = useNavigation();
const router=useRouter();
  // Extract parameters from route
  const { name, phone, about } = route.params || {};

  // Local state for user inputs
  const [editedName, setEditedName] = useState(name || "");
  const [editedPhone, setEditedPhone] = useState(phone || "");
  const [editedAbout, setEditedAbout] = useState(about || "");
  const [isSaving, setIsSaving] = useState(false);

  // Make sure you import useRouter

const handleSave = async () => {
  try {
    setIsSaving(true);
    const authenticatedUser = await Auth.currentAuthenticatedUser();
    const userId = authenticatedUser.attributes.sub;

    // Save updates to the database
    await API.graphql(
      graphqlOperation(updateUser, {
        input: {
          id: userId,
          name: editedName,
          phonenumber: editedPhone,
          status: editedAbout,
        },
      })
    );

    // Reflect changes immediately
    Alert.alert("Success", "Profile updated successfully.");

    // Navigate back to Settings with updated params using Expo Router
    router.push({
      pathname: "/(tabs)/settings", // Adjust the path to your Settings screen route
      params: {
        updatedName: editedName,
        updatedPhone: editedPhone,
        updatedAbout: editedAbout,
      },
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    Alert.alert("Error", "Failed to update profile.");
  } finally {
    setIsSaving(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={editedName}
        onChangeText={setEditedName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={editedPhone}
        onChangeText={setEditedPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>About</Text>
      <TextInput
        style={[styles.input, styles.aboutInput]}
        value={editedAbout}
        onChangeText={setEditedAbout}
        placeholder="About yourself"
        multiline
      />

      <Pressable style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
        <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
  aboutInput: { height: 100, textAlignVertical: "top" },
  saveButton: { backgroundColor: "#4CAF50", padding: 15, alignItems: "center", borderRadius: 5 },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: { backgroundColor: "#ddd", padding: 15, alignItems: "center", borderRadius: 5 },
  cancelButtonText: { color: "#333", fontSize: 16, fontWeight: "bold" },
});
