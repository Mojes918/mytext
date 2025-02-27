import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: { padding: 5, marginBottom: 0 },
  row: { flexDirection: 'row' },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginRight: 5,
    padding: 5,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, borderRadius: 25 },
  icon: { marginHorizontal:5},
  buttonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3777f0',
    borderRadius: 25,
    
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3777f0',
    borderRadius: 25,
    //marginHorizontal:10
  },
  cameraContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    //marginHorizontal:5
  },
  sendImageContainer: {
    flexDirection: 'row',
    margin: 10,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  sendAudioContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding:15,
    alignItems:"center",
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    
  },
  AudioBackground:{
    height:5,
    flex:1,
    backgroundColor:"lightgray",
    borderRadius:5,
    margin:10
  },
  menuContainer: {
    //backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    alignItems:"center",
    padding:10
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: 70,
  },
  menuText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color:"gray"
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  replyBar: {
    width: 5,
    height: '100%',
    backgroundColor: '#3777f0',
    borderRadius: 2,
    marginRight: 10,
  },
  replyContent: { flex: 1 },
  replyTitle: { fontWeight: 'bold', color: '#3777f0' },
  replyMessage: { color: '#000', marginTop: 2 },
  replyImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginTop: 5,
  },
  cropButton: {
    backgroundColor: '#3777f0',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    padding: 8,
  },
  
});





