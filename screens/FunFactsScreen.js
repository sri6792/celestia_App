import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const FUN_FACTS = [
  "A day on Venus is longer than a year on Venus!",
  "Neutron stars can spin 600 times per second.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Saturn could float in water because it’s extremely light!",
  "One million Earths can fit inside the Sun.",
  "Space is completely silent — no medium for sound.",
  "A spoon of neutron star weighs a billion tons!",
  "Milky Way will collide with Andromeda in 3.75 billion years.",
  "There is a giant cloud in space made of alcohol!",
  "Jupiter has 95+ moons.",
];

const FunFactsScreen = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      {/* BACKGROUND IMAGE */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
        }}
        style={styles.background}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.95)"]}
          style={styles.overlay}
        />
      </ImageBackground>

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Cosmic Fun Facts</Text>
        <Text style={styles.headerSubtitle}>
          Swipe through fascinating wonders of the universe ✨
        </Text>
      </View>

      {/* FUN FACT CARDS */}
      <Animated.FlatList
        data={FUN_FACTS}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [-1, 0, 150 * index, 150 * (index + 2)];
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0.85],
          });

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0.3],
          });

          return (
            <Animated.View style={[styles.cardContainer, { opacity, transform: [{ scale }] }]}>
              <LinearGradient
                colors={["#5e60ce", "#4ea8de", "#56cfe1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.cardText}>{item}</Text>
              </LinearGradient>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default FunFactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000014",
  },

  // Background
  background: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  // Header
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 12,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 6,
    color: "#dcdcdc",
  },

  // Cards
  cardContainer: {
    marginBottom: 18,
    alignItems: "center",
  },
  card: {
    width: width * 0.88,
    padding: 20,
    borderRadius: 24,
    elevation: 12,
    shadowColor: "#5e60ce",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  cardText: {
    color: "white",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "600",
  },
});
