import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

interface Anime {
  mal_id: string,
  title: string,
  url: string,
  images: {
    webp: {
      image_url: string;
    };
  },
  genres: {
      name: string
  }[],
  rating: string,
  score: Double,
}

// URL HERE
const URL = `URL HERE`;
// Filter fetched anime [get if anime has a score of 8 and over]
const endPointURL = `${URL}anime?min_score=8&limit=20&order_by=score&sort=desc`;

export default function Index() {

  const [animes, setAnimes] = useState<Anime[]>([]);
  const [searchText, setSearchText] = useState("");
  
  useEffect(() => {
    // Fetch Animes
    fetchAnimes()
  }, [])

  const handleSearch = async (text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchText(text);

    if (text.trim().length > 2)
    {
      try
      {
        const endpointSearch = `${URL}anime?q=${encodeURIComponent(text)}&limit=12`;
        const response = await fetch(endpointSearch);
        const jsonData = await response.json();

        if (jsonData && jsonData.data)
        {
          setAnimes(jsonData.data);
        }
      } catch(e)
      {
        console.error("Search Failed: ", e);
      }
    } else if (text.trim().length === 0)
    {
      fetchAnimes();
      return;
    }
  }

  async function fetchAnimes() {
    try {
      const response = await fetch(endPointURL);
      const jsonData = await response.json();

      // Shuffle the anime fetched
      const shuffledAnimes = jsonData.data.sort(() => 0.5 - Math.random());

      const randomAnime = shuffledAnimes.slice(0, 6);
      
      setAnimes(randomAnime);
    } catch(e) {
      console.log(e);
    } 
  }
  
  return (
    <ScrollView contentContainerStyle={{
      gap: 40,
      padding: 18,
      backgroundColor: "rgb(35, 28, 47)",
      alignItems: "center"
    }}>

      <View style={styles.headerContainer}>
        <View style={styles.searchWrapper}>
          <AntDesign name="search" size={18} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search Anime Here"
            placeholderTextColor="rgb(255, 255, 255, 0.4)"
            onChangeText={(text) => handleSearch(text)}
            returnKeyType="search"
            value={searchText}
            onSubmitEditing={() => handleSearch(searchText)}
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                handleSearch(""); 
                setSearchText("");
              }}
              style={styles.clearButton}
            >
              <AntDesign name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.shuffleButton}
          onPress={fetchAnimes}
        >
          <MaterialCommunityIcons name="shuffle-variant" size={24} color="white" style={{alignSelf: "center"}} />
        </TouchableOpacity>
      </View>

      {searchText.length === 0 && (
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Here is the best six for you</Text>
        </View>
      )}

      <View style={styles.gridContainer}>
        {animes.map((anime) => {
        return (
          <Link 
            key={anime.mal_id} 
            href={{ pathname: "/aniDetailScreen", params: {mal_id: anime.mal_id.toString()} }}>
            <View  style={{
            backgroundColor: "rgb(58, 52, 69)",
            padding: 20,
            borderRadius: 10,
            width: 460,
            shadowColor: "black",
            shadowOffset: {width: 10, height: 10},
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 10
          }}>
            <Text style={styles.title}>{anime.title}</Text>
            <View style={{
              flexDirection: "row",
              gap: 24,
              alignItems: "center",
              padding: 20,
              backgroundColor: "transparent",
            }}>
              <View style={{
                height: 168
              }}>
                <Image 
                source={{uri: anime.images.webp.image_url}}
                style={{
                  flex: 1,
                  width: '100%', 
                  aspectRatio: 2 / 3,
                  height: 180, 
                  borderRadius: 10,
                  margin: 0,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: 2
                }}
              />
              </View>
              <View style={{
                backgroundColor: "transparent",
                flex: 1,
                flexShrink: 1
              }}>
                <Text style={styles.rating}><Text style={{fontSize: 9.4, fontWeight: 'bold', color: "rgba(255, 255, 255, 0.8)"}}>Genres :</Text> {anime.genres.map(g => g.name).join(',   ')}</Text>
                <Text style={styles.rating}><Text style={{fontSize: 9.4, fontWeight: 'bold', color: "rgba(255, 255, 255, 0.8)"}}>Rating :</Text> {anime.rating}</Text>
                <Text style={styles.rating}><Text style={{fontSize: 9.4, fontWeight: 'bold', color: "rgba(255, 255, 255, 0.8)"}}>Score :</Text> {anime.score}</Text>
              </View>
            </View>
          </View>
          </Link>
        );
      })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(58, 52, 69)",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45
  },

  headerContainer: {
    flexDirection: "row",
    padding: 18,
    gap: 20,
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "space-evenly",
    borderRadius: 14,
    borderBlockColor: "rgba(255, 255, 255, 0.6)",
    width: '100%'
  },
  searchBar: {
    flex: 1,
    height: 45,
    backgroundColor: "rgb(58, 52, 69)",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "white"
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  clearText: {
    color: "#ccc",
    fontWeight: "bold",
    fontSize: 16,
  },
  shuffleButton: {
    backgroundColor: "#45108f",
    height: 45,
    width: 45,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 24,
    alignSelf: "center",
  },
  welcomeSection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'transparent', 
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    width: '100%',
    marginBottom: 10
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    gap: 14
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)"
  },

  rating: {
    fontSize: 8.4,
    fontWeight: 'bold',
    color: "rgba(255, 255, 255, 0.6)",
    margin: 0,
    lineHeight: 14
  },

  score: {
    fontSize: 8.4,
    fontWeight: 'bold',
    color: "white",
    margin: 0
  }
})
