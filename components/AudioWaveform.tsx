import React, { useState, useEffect } from 'react';
import Svg, { Rect } from 'react-native-svg'; // Ensure this is installed

import { Audio } from 'expo-av';

// Define states and functions
const [sound, setSound] = useState<Audio.Sound | null>(null); // Ensure 'sound' is declared
const [paused, setPaused] = useState(true);
const [waveform, setWaveform] = useState<number[]>([]);

// Generate dummy waveform data
const generateWaveform = () => {
  const data = Array.from({ length: 50 }, () => Math.random() * 100);
  setWaveform(data);
};

// When sound is loaded, generate waveform data
useEffect(() => {
  if (sound) {
    generateWaveform();
  }
}, [sound]);

// Play or pause the sound
const playPauseSound = async () => {
  if (!sound) return;
  if (paused) {
    setPaused(false);
    await sound.playAsync();
  } else {
    setPaused(true);
    await sound.pauseAsync();
  }
};

// Render waveform
const renderWaveform = () => {
  return (
    <Svg height="50" width="100%">
      {waveform.map((value, index) => (
        <Rect
          key={index}
          x={(index * 6).toString()}
          y={(50 - value).toString()}
          width="5"
          height={value.toString()}
          fill="#3777f0"
        />
      ))}
    </Svg>
  );
};

// UI for Audio with Waveform
/*
return (
  <View style={{ margin: 10 }}>
    {sound && (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={playPauseSound} style={{ marginRight: 10 }}>
          <Feather name={paused ? 'play' : 'pause'} size={24} color="black" />
        </Pressable>
        <View style={{ flex: 1 }}>{renderWaveform()}</View>
      </View>
    )}
  </View>
);*/
