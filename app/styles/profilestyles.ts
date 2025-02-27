import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1 },
    profileContainer: { 
      width: "100%", 
      height: 200, 
      position: "relative", 
      backgroundColor: "#fff" 
    },
    backgroundImage: { 
      width: "100%", 
      height: "100%", 
      justifyContent: "flex-end", 
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1, 
    },
    profileImage: { 
      height: 100, 
      width: 100, 
      borderRadius: 60, 
      borderWidth: 4, 
      borderColor: "white", 
      position: "absolute", 
      bottom:-50, // Positioned halfway into the background image
      left: 10, 
      //marginLeft: -60, // To center the profile image horizontally
      zIndex: 2, 
    },
    cameraIconProfile: { 
      position: "absolute", 
      bottom: -50, 
      left: 80, 
      backgroundColor: "#444", 
      borderRadius: 15, 
      padding: 5, 
      zIndex: 3 
    },
    cameraIconBackground: { 
      position: "absolute", 
      top: 10, 
      right: 10, 
      backgroundColor: "#444", 
      borderRadius: 20, 
      padding: 8, 
      zIndex: 3 
    },
    profileName: { 
      fontSize: 22, 
      fontWeight: "bold",  
    position:"absolute",
    left:20,bottom:-90,
      color: "#fff",
      
    },
    profileNumber: { 
      fontSize: 16, 
      fontWeight: "bold", 
      position:"absolute",
      left:20,bottom:-110,
      color: "#fff"
    },
    aboutContainer: { 
      paddingHorizontal: 20, 
      marginTop: 120
    },
    aboutInput: { 
      fontSize: 16, 
      //borderBottomWidth: 1, 
      borderBottomColor: "#ccc", 
      paddingVertical: 10,
      color: "#fff",
      minHeight: 50, // Allows it to grow dynamically
      textAlignVertical: "top", // Aligns text properly
      flexWrap: "wrap",
      flexShrink: 1,
      width: "100%", // Ensures it takes full width
    },
    
    editButton: {
      marginTop: 20,
      borderColor: "gray",
      borderWidth: 2,
      padding: 10,
      width: 200,
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    editButtonText: { fontSize: 16, fontWeight: "bold" },
    logoutContainer: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 20, paddingBottom: 30 },
    logoutButton: {
  
      backgroundColor: "#FF6F61",
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    logoutButtonText: { fontSize: 18, fontWeight: "bold", color: "white" },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
      alignItems: "center",
    },
    modalImage: {
      width: 300,
      height: 300,
      borderRadius: 150,
    },
    
  });
  export default styles; // Add this line