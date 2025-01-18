import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter} from 'expo-router';
import { useRoute } from '@react-navigation/native';

const SuccessScreen = () => {

  const router = useRouter();
  const route = useRoute();
  const { message, scheduledTime,contact } = route.params || {}; // Access params for query
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Message Scheduled Successfully!</Text>
      <Text style={styles.info}>Message: {message}</Text>
      <Text style={styles.info}>Scheduled Time: {scheduledTime}</Text>
      <Text style={styles.info}>Recipient: {contact}</Text>
      <Button title="Go to Home" onPress={() => router.push('/')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SuccessScreen;
