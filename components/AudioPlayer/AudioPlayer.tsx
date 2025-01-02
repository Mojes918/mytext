import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';

// Define the props type
interface AudioPlayerProps {
  soundUri: string;
  onClose?: () => void; // Optional callback for closing
  isSent?: boolean; // Determines if the message is sent
  onDeleteAudio?: () => void; // Callback for deleting the audio
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ soundUri, onClose, isSent = false, onDeleteAudio }) => {
  const [paused, setPaused] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const loadSound = async () => {
      if (!soundUri) return;
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        {},
        onPlaybackStatusUpdate
      );
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [soundUri]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setAudioProgress(status.positionMillis / (status.durationMillis || 1));
    setPaused(!status.isPlaying);
    setAudioDuration(status.durationMillis || 0);

    if (status.didJustFinish) {
      // Reset to the start after playback ends
      setAudioProgress(0);
      setPaused(true);
    }
  };

  const playPauseSound = async () => {
    if (!sound) return;
    if (paused) {
      await sound.playAsync();
    } else {
      await sound.pauseAsync();
    }
  };

  const stopAndUnloadSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      if (onClose) onClose(); // Inform parent to remove the container
    }
  };

  const handleDeleteAudio = async () => {
    if (onDeleteAudio) {
      onDeleteAudio(); // Inform parent to delete the audio
    }
    stopAndUnloadSound(); // Also stop and unload the audio
  };

  const getElapsedTime = () => {
    const elapsedMillis = audioProgress * audioDuration;
    const minutes = Math.floor(elapsedMillis / (60 * 1000));
    const seconds = Math.floor((elapsedMillis % (60 * 1000)) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getTotalDuration = () => {
    const minutes = Math.floor(audioDuration / (60 * 1000));
    const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.audioContainer}>
        {/* Conditionally render the close icon only if not sent */}
        {!isSent && (
          <Pressable style={styles.controlButton} onPress={handleDeleteAudio}>
            <AntDesign name="closecircleo" size={20} color="black" />
          </Pressable>
        )}
        <Pressable style={styles.controlButton} onPress={playPauseSound}>
          <Feather name={paused ? 'play' : 'pause'} size={24} color="black" />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${audioProgress * 100}%` }]} />
        </View>
        <Text style={styles.timer}>{`${getElapsedTime()} / ${getTotalDuration()}`}</Text>
      </View>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    maxWidth: '80%',
    paddingHorizontal: 10,
    borderRadius: 10,
    margin: 3,
  },
  audioContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  controlButton: {
    marginHorizontal: 8,
  },
  progressContainer: {
    flex: 1,
    height: 5,
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    marginHorizontal: 10,
    position: 'relative',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#3777f0',
    borderRadius: 5,
    position: 'absolute',
  },
  timer: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: 'black',
  },
});
