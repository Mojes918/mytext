import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";

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

export default function settings() {
  const currentTheme = useColorScheme() || "dark"; // Auto-detect system theme, fallback to 'dark'
  const theme = colorScheme[currentTheme]; // Apply theme dynamically

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Section */}
      <View style={[styles.profileContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image
          source={
                require("../../assets/images/images13.jpg")
            } style={{height:80,width:80,borderRadius:50}}/>
        <View style={styles.profileText}>
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>Vikram_Aditya✌️✌️</Text>
          <Text style={[styles.profileStatus, { color: theme.textSecondary }]}>Take me back to the day...</Text>
        </View>
        {<TouchableOpacity>
          <Entypo name="dots-three-vertical" size={20} color={theme.icon} />
        </TouchableOpacity>}
      </View>

      {/* Options List */}
      <ScrollView style={styles.listContainer}>
        <OptionItem
          icon="key"
          title="Account"
          subtitle="Security notifications, change number"
          theme={theme}
        />
        <OptionItem
          icon="lock-closed"
          title="Privacy"
          subtitle="Block contacts, disappearing messages"
          theme={theme}
        />
        <OptionItem
          icon="person-circle"
          title="Avatar"
          subtitle="Create, edit, profile photo"
          theme={theme}
        />
        <OptionItem
          icon="list"
          title="Lists"
          subtitle="Manage people and groups"
          theme={theme}
        />
        <OptionItem
          icon="chatbubble-ellipses"
          title="Chats"
          subtitle="Theme, wallpapers, chat history"
          theme={theme}
        />
        <OptionItem
          icon="notifications"
          title="Notifications"
          subtitle="Message, group & call tones"
          theme={theme}
        />
        <OptionItem
          icon="cloud-download"
          title="Storage and data"
          subtitle="Network usage, auto-download"
          theme={theme}
        />
        <OptionItem
          icon="globe"
          title="App language"
          subtitle="English (device’s language)"
          theme={theme}
        />
        <OptionItem
          icon="chatbubble-outline"
          title="Complaint Box"
          subtitle="Chat with us if you have a problem"
          theme={theme}
        />
        <OptionItem
          icon="ban"
          title="Block"
          subtitle="Blocked or hidden"
          theme={theme}
        />
        <OptionItem
          icon=""
          title="Invite friends"
          subtitle=""
          theme={theme}
        />
         <OptionItem
          icon=""
          title="Log Out"
          subtitle=""
          theme={theme}
        />
      </ScrollView>
    </View>
  );
}

type OptionItemProps = {
    icon: keyof typeof Ionicons.glyphMap; // Use Ionicons' predefined icon names
    title: string;
    subtitle: string;
    theme:any;
  };

const OptionItem = ({ icon, title, subtitle, theme }:OptionItemProps) => (
  <TouchableOpacity style={[styles.optionContainer, { borderColor: theme.border }]}>
    <Ionicons name={icon} size={24} color={theme.icon} style={styles.icon} />
    <View style={styles.optionText}>
      <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    borderBottomWidth: 0.5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileText: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileStatus: {
    fontSize: 14,
  },
  listContainer: {
    paddingTop: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 12,
  },
});
