import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";

interface Anime {
  mal_id: string,
  title: string,
  synopsis: string,
  images: {
    webp: {
      large_image_url: string;
    };
  }
}

// URL HERE
const URL = `URL HERE`;

export default function AniDetailScreen() {
  const { mal_id } = useLocalSearchParams<{ mal_id: string }>();
  // console.log("Received ID on Detail Screen:", mal_id);
  const [anime, setAnimes] = useState<Anime | null>(null);

  useEffect(() => {
  if (mal_id) {
    fetchAnimeDetails(mal_id);
  }
}, [mal_id]);


  async function fetchAnimeDetails(query: string)
  {
    try
    {
      const endPointURL = `${URL}anime/${mal_id}`;
      const response = await fetch(endPointURL);
      const jsonData = await response.json();

      if (jsonData && jsonData.data)
      {
        setAnimes(jsonData.data);
      }
    } catch(e)
    {
        console.log(e);
    }
  }

  return (
    <View style={styles.container}>

      <ImageBackground
        source={{ uri: anime?.images?.webp?.large_image_url }}
        style={StyleSheet.absoluteFillObject} 
        resizeMode="cover"
      >
        <BlurView intensity={98} tint="light" style={StyleSheet.absoluteFillObject} />
      </ImageBackground>

      <ScrollView contentContainerStyle={{
        gap: 40,
        padding: 18, 
        backgroundColor: "rgba(242, 242, 242, 0.8)"
      }}>
        {anime ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            {anime.title}
          </Text>
          
          <Text style={{ marginTop: 10 }}>
            {anime.synopsis}
          </Text>
        </>
      ) : (
        <Text style={{textAlign: "center"}}>Loading anime details...</Text>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  }
})
