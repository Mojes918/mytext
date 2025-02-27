// styles.ts
import { StyleSheet } from 'react-native';

export const dynamicStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? '#111' : '#ffffff',
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 15,
    color: isDarkMode ? 'white' : 'black',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#565656',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }
});
export default dynamicStyles; // Add this line