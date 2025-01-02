import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { API, Auth, Storage } from 'aws-amplify';
import { getUser } from '../../src/graphql/queries';
import { format } from 'date-fns';
import { S3Image } from 'aws-amplify-react-native';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { Ionicons } from '@expo/vector-icons';

interface MessageProps {
  message: {
    audio: string;
    content: string;
    userID: string;
    createdAt: string;
    image?: string;
  };
  isFirst: boolean;
  isSameUser: boolean;
}

interface User {
  id: string;
  name: string;
}

const Message = ({ message, isFirst, isSameUser }: MessageProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  const [user, setUser] = useState<User | null>(null);
  const [isMe, setIsMe] = useState(false);
  const [soundUri, setSoundUri] = useState<string | null>(null);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio)
        .then(setSoundUri)
        .catch((error) => console.error('Error loading audio:', error));
    }
  }, [message]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: any = await API.graphql({
          query: getUser,
          variables: { id: message.userID },
        });
        setUser(userData?.data?.getUser || null);
      } catch (error) {
        console.error(`Error fetching user with ID ${message.userID}:`, error);
      }
    };
    fetchUser();
  }, [message.userID]);

  useEffect(() => {
    const checkIfMe = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setIsMe(user?.id === authUser.attributes.sub);
      } catch (error) {
        console.error('Error checking user identity:', error);
      }
    };
    if (user) checkIfMe();
  }, [user]);

  if (!user) {
    return <ActivityIndicator style={{ margin: 10 }} />;
  }

  const formattedDate = format(new Date(message.createdAt), 'p');

  const containerStyle = [
    styles.container,
    isMe ? styles.rightContainer : styles.leftContainer,
    {
      backgroundColor: isMe
        ? isDarkMode
          ? '#3953a3'
          : '#3777f0'
        : isDarkMode
        ? '#1d1d1d'
        : '#e0e0e0',
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      borderTopLeftRadius: isFirst && !isMe ? 0 : 10,
      borderTopRightRadius: isFirst && isMe ? 0 : 10,
      marginTop: isSameUser ? 2 : 2,
    },
  ];

  const textStyle = {
    color: isMe ? 'white' : isDarkMode ? 'white' : 'black',
  };

  const timestampStyle = {
    fontSize: 8,
    color: isMe ? 'white' : isDarkMode ? 'white' : 'gray',
    marginTop: 5,
  };

  return (
    <View style={containerStyle}>
      {message.image && (
        <View style={styles.imageContainer}>
          <S3Image
            imgKey={message.image}
            style={{
              width: width * 0.7,
              aspectRatio: 4 / 3,
              borderRadius: 10,
              marginBottom: 5,
            }}
            resizeMode="cover"
          />
          {!message.content && (
            <>
            <View style={{flexDirection:"row",gap:10}}>
            <Text style={timestampStyle}>{formattedDate}</Text>
            {
              isMe&&
          <Ionicons name="checkmark" size={16} color="white" />}
          </View>
            </>
          )}
        </View>
      )}
      {soundUri && (
        <>
          <AudioPlayer soundUri={soundUri} onClose={()=>setSoundUri(null)}/>
          {!message.content && ( <>
            <View style={{flexDirection:"row",gap:10,justifyContent:"flex-end"}}>
            <Text style={timestampStyle}>{formattedDate}</Text>
            {
              isMe&&
          <Ionicons name="checkmark" size={16} color="white" />}
          </View>
            </>
          )}
        </>
      )}
      {message.content && (
        <View style={styles.row}>
          <View style={styles.messageContent}>
            <Text style={textStyle}>{message.content}</Text>
          </View>
          <View style={{gap:10,flexDirection:"row"}}>
          <Text style={timestampStyle}>{formattedDate}</Text>
          {
            isMe&&
          <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap:10
  },
  messageContent: {
    maxWidth: '75%',
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
});

export default Message;
