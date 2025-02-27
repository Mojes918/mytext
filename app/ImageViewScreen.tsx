import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator,Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from 'aws-amplify';
import { useRouter } from 'expo-router';

export default function ImageViewerScreen() {
    const route = useRoute();
    const { imgKey } = route.params;
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
const router=useRouter();
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const signedUrl = await Storage.get(imgKey, { level: 'public' }); // Use 'private' if necessary
                setImageUrl(signedUrl);
            } catch (err) {
                console.error("Error fetching image:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchImageUrl();
    }, [imgKey]);
    //console.log("Image Key:", imgKey);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="white" />
            ) : error ? (
            
                <Text style={{ color: 'white' }}>Failed to load image</Text>
                
            ) : (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
