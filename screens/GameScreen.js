// screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const games = [
  'Satellite Docking',
  'Planet Catcher',
];

// Star generator
const createStars = (num) => {
  const stars = [];
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      opacity: new Animated.Value(Math.random()),
    });
  }
  return stars;
};

export default function GameScreen({ navigation }) { // <- add navigation
  const [stars, setStars] = useState(createStars(100));

  useEffect(() => {
    stars.forEach(star => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, { toValue: 0, duration: 1000 + Math.random() * 1000, useNativeDriver: true }),
          Animated.timing(star.opacity, { toValue: 1, duration: 1000 + Math.random() * 1000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

const handlePlayGame = (game) => {
 if (game === 'Planet Catcher') navigation.navigate('PlanetCatcher');
else if (game === 'Satellite Docking') navigation.navigate('DockingSimulator');

};



  return (
    <View style={styles.container}>
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: star.y,
            left: star.x,
            width: star.size,
            height: star.size,
            borderRadius: star.size / 2,
            backgroundColor: '#fff',
            opacity: star.opacity,
          }}
        />
      ))}

      <View style={styles.overlay}>
        <Text style={styles.title}>🌌 Space Games</Text>
        {games.map((game, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gameButton}
            onPress={() => handlePlayGame(game)}
          >
            <Text style={styles.gameText}>{game}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000010' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,30,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 38, fontWeight: 'bold', color: '#FFD700', marginBottom: 40, textAlign: 'center', textShadowColor: '#00FFFF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  gameButton: { backgroundColor: '#1E90FF', paddingVertical: 18, paddingHorizontal: 50, borderRadius: 20, marginVertical: 12, width: '80%', alignItems: 'center', shadowColor: '#00FFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  gameText: { fontSize: 24, color: 'white', fontWeight: '700' },
});
