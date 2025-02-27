import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { CheckCircle, MessageCircle, XCircle } from "lucide-react-native";

// Custom Toast styles
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#2ecc71",
        backgroundColor: "#ecfdf5",
        borderRadius: 20,
        height: 100, // Increased height
        width: "95%", // Adjust width
        alignSelf: "center",
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        justifyContent: "center", // Center content vertically
      }}
      text1Style={{
        fontSize: 16, // Larger text
        fontWeight: "bold",
        color: "#2ecc71",
      }}
      text2Style={{
        fontSize: 14,
        color: "#27ae60",
      }}
      renderLeadingIcon={() => <CheckCircle color="#2ecc71" size={30} />} // Larger icon
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#3498db",
        backgroundColor: "#eef6fc",
        borderRadius: 10,
        height: 80, // Increased height
        width: "90%", // Adjust width
        alignSelf: "center",
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        justifyContent: "center",
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#3498db",
      }}
      text2Style={{
        fontSize: 16,
        color: "#2980b9",
      }}
      renderLeadingIcon={() => <MessageCircle color="#3498db" size={30} />}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#e74c3c",
        backgroundColor: "#fdecea",
        borderRadius: 10,
        height: 80, // Increased height
        width: "90%", // Adjust width
        alignSelf: "center",
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        justifyContent: "center",
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#e74c3c",
      }}
      text2Style={{
        fontSize: 16,
        color: "#c0392b",
      }}
      renderLeadingIcon={() => <XCircle color="#e74c3c" size={30} />}
    />
  ),
};

// Function to show a notification
export const showInAppNotification = (message: string, type: "success" | "info" | "error" = "info") => {
  Toast.show({
    type, // You can pass "success", "info", or "error"
    text1: "Notification",
    text2: message,
    position: "top",
    topOffset: 50,
    visibilityTime: 3000,
  });
};

// Provider to render Toast with adjusted topOffset globally
export const InAppNotificationProvider = () => (
  <Toast config={toastConfig} topOffset={50} />
);
