// screens/ExploreScreen.js
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const NASA_API_KEY = "3aXtMTzwWLcKgoHE0CzQSgdVHLGMTBL7EofFhY8c";

export default function ExploreScreen() {
  const navigation = useNavigation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchSearchResults = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://images-api.nasa.gov/search?q=${query}&media_type=image`
      );

      const data = await res.json();
      const items = data?.collection?.items ?? [];

      setResults(items);
    } catch (err) {
      console.log("NASA SEARCH ERROR:", err);
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#0a0220", "#15063a", "#1a094d"]}
      style={styles.container}
    >
      <StatusBar translucent barStyle="light-content" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={26} color="#7DF9FF" />
      </TouchableOpacity>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Search NASA space images</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#a78bfa" />
          <TextInput
            style={styles.input}
            placeholder="Search nebula, mars, galaxy..."
            placeholderTextColor="#8e8ca8"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity onPress={fetchSearchResults}>
            <Ionicons name="arrow-forward-circle" size={28} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        {/* Results Title */}
        <Text style={styles.sectionTitle}>Search Results</Text>

        {/* Loading Indicator */}
        {loading && (
          <ActivityIndicator size="large" color="#7DF9FF" style={{ marginTop: 20 }} />
        )}

        {/* Results Grid */}
        {!loading && (
          <FlatList
            data={results}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
             const img = item.links?.[0]?.href;
             const data = item.data?.[0];

             if (!img || !data) return null;

                return (
               <TouchableOpacity
                 style={styles.resultCard}
                 onPress={() =>
                   navigation.navigate("ExploreDetail", {
                   title: data.title,
                   description: data.description,
                   image: img,
        })
      }
    >
      <Image source={{ uri: img }} style={styles.resultImage} />
      <Text style={styles.resultTitle} numberOfLines={2}>
        {data.title}
      </Text>
    </TouchableOpacity>
  );
}}

            contentContainerStyle={{ paddingBottom: 150 }}
          />
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (StatusBar.currentHeight || 44) + 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#e6f0ff",
  },
  subtitle: {
    color: "#bfcdf5",
    fontSize: 14,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: "#cbd9ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
  },
  resultCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    height: 140,
  },
  noImageBox: {
    width: "100%",
    height: 140,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#ccc",
    fontSize: 12,
  },
  resultTitle: {
    color: "#f0f8ff",
    padding: 8,
    fontSize: 12,
    fontWeight: "600",
  },
});
