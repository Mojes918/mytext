import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
   padding:9,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 15,
    maxWidth: '80%',
    position: "relative"

  },
  othercontainer:{
    padding:4,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 15,
    maxWidth: '80%',
    position: "relative"
  },
  rightArrow: {
    position: "absolute",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },

  rightArrowOverlap: {
    position: "absolute",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20

  },
  leftArrow: {
    position: "absolute",
    backgroundColor: "#dedede",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10
  },

  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20

  },
  rightArrowonly: {
    position: "absolute",
    width: 20,
    height: 25,
    bottom: -5,
    borderBottomLeftRadius: 25,
    right: -15
  },

  rightArrowOverlaponly: {
    position: "absolute",
    width: 20,
    height: 35,
    bottom: -10,
    borderBottomLeftRadius: 18,
    right: -30

  },
  leftArrowonly: {
    position: "absolute",
    backgroundColor: "#dedede",
    width: 20,
    height: 25,
    bottom: -5,
    borderBottomRightRadius: 25,
    left: -15
  },

  leftArrowOverlaponly: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    width: 20,
    height: 35,
    bottom: -10,
    borderBottomRightRadius: 18,
    left: -30

  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  messageContent: {
    maxWidth: '80%',
  },
  imageContainer: {
    alignItems: 'flex-end',
  },
  leftContainer: {
    alignSelf: 'flex-start',

  },
  rightContainer: {
    alignSelf: 'flex-end',

  },
  replyWrapper: {
    marginBottom: 2, // Add some space between the reply and the main message
  },
  replyContainer: {
    backgroundColor: '#d4f8e8', // Light green background for the reply
    padding: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#34b7f1', // Add a blue line on the left
  },
  replyUser: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#075e54', // Dark green text for the username
    marginBottom: 2,
  },
  replyContent: {
    fontSize: 14,
    color: '#000', // Black text for the content
  },
  replyImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginTop: 5,
  },
  replyAudioContainer: {
    backgroundColor: '#d4f8e8', // Light green background to match the reply container
    padding: 8,
    borderRadius: 10,
    marginTop: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#34b7f1',
    flexDirection: "row"// Blue line for reply differentiation
  },
});


