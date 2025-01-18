import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

const ScheduleMessageScreen = () => {
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const textColor = isDarkMode ? 'white' : 'black';
  const selectColor = isDarkMode ? '#3d3d3d' : '#ddd';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';

  const handleSchedule = () => {
    if (!message || !scheduledTime) {
      alert('Please enter a message and select a time!');
      return;
    }

    // Pass params correctly
    router.push({
      pathname: '/SelectContact',
      params: { message: message, scheduledTime: scheduledTime } // Pass params with Expo Router
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Schedule a Message</Text>

      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Enter your message"
        placeholderTextColor={textColor}
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.timeButton, { borderColor: textColor }]}>
        <Text style={{ color: textColor }}>{scheduledTime || 'Select Time to Send'}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        onConfirm={(date) => {
          setScheduledTime(format(date, 'yyyy-MM-dd HH:mm:ss'));
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <TouchableOpacity onPress={handleSchedule} style={[styles.nextButton, { backgroundColor: selectColor }]}>
        <Text style={[styles.nextButtonText, { color: textColor }]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  timeButton: {
    marginBottom: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleMessageScreen;
