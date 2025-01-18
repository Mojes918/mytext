import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface AudioPlayerProps {
  soundUri: string;
  onClose?: () => void;
  isSent?: boolean;
  onDeleteAudio?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ soundUri, onClose, isSent = false, onDeleteAudio }) => {
  const [isPaused, setIsPaused] = useState(true);  // Initially paused
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      if (!soundUri) return;
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: soundUri },
          {},
          onPlaybackStatusUpdate
        );
        if (isMounted) setSound(sound);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [soundUri]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    // Update progress
    setProgress(status.positionMillis / (status.durationMillis || 1));
    setDuration(status.durationMillis || 0);

    if (status.didJustFinish) {
      // When finished, stop playing and reset to the beginning
      setProgress(0);
      setIsPaused(true); // Stop playing after finish
      if (sound) {
        sound.setPositionAsync(0); // Reset to the beginning
      }
    } else {
      setIsPaused(!status.isPlaying); // Pause or play depending on status
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    try {
      if (isPaused) {
        // If paused, play the audio
        await sound.playAsync();
        setIsPaused(false);  // Set to playing
      } else {
        // If playing, pause the audio
        await sound.pauseAsync();
        setIsPaused(true);  // Set to paused
      }
    } catch (error) {
      console.error("Error controlling playback:", error);
    }
  };

  const stopAndUnload = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        if (onClose) onClose();
      } catch (error) {
        console.error("Error stopping/unloading sound:", error);
      }
    }
  };

  const deleteAudio = async () => {
    if (onDeleteAudio) {
      onDeleteAudio();
    }
    stopAndUnload();
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.audioContainer}>
        {!isSent && (
          <Pressable style={styles.iconButton} onPress={deleteAudio}>
            <AntDesign name="closecircleo" size={20} color="black" />
          </Pressable>
        )}
        <Pressable style={styles.iconButton} onPress={togglePlayPause}>
          <Feather name={isPaused ? 'play' : 'pause'} size={24} color="black" />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.timer}>
          {`${formatTime(progress * duration)} / ${formatTime(duration)}`}
        </Text>
      </View>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    maxWidth: '85%',
    padding: 10,
    borderRadius: 12,
    margin: 5,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  iconButton: {
    marginHorizontal: 8,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4caf50',
  },
  timer: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
});
