// screens/PlanetCatcherScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Image, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const SPACESHIP_SIZE = 60;
const OBJECT_SIZE = 50;
const FALL_SPEED = 5;
const MOVE_SPEED = 20;

// Generate stars for background
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

export default function PlanetCatcherScreen() {
  const [spaceshipX, setSpaceshipX] = useState(width / 2 - SPACESHIP_SIZE / 2);
  const [objects, setObjects] = useState([]); // planets & asteroids
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [stars] = useState(createStars(100));

  // Animate stars
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

  // Spawn objects (planets or asteroids)
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const x = Math.random() * (width - OBJECT_SIZE);
      const type = Math.random() < 0.8 ? 'planet' : 'asteroid'; // 80% planets, 20% asteroid
      setObjects(prev => [...prev, { x, y: -OBJECT_SIZE, type, key: Date.now() + Math.random() }]);
    }, 700);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move objects and detect collisions
  useEffect(() => {
    if (gameOver) return;
    const moveInterval = setInterval(() => {
      setObjects(prev => {
        const updated = prev.map(obj => ({ ...obj, y: obj.y + FALL_SPEED }));
        updated.forEach(obj => {
          if (
            obj.y + OBJECT_SIZE >= height - SPACESHIP_SIZE - 20 &&
            obj.x + OBJECT_SIZE >= spaceshipX &&
            obj.x <= spaceshipX + SPACESHIP_SIZE
          ) {
            if (obj.type === 'planet') setScore(prev => prev + 10);
            else setScore(prev => Math.max(prev - 5, 0));
            obj.caught = true; // mark for removal
          }
          if (obj.y >= height) setGameOver(true); // game over if object reaches bottom
        });
        return updated.filter(obj => !obj.caught && obj.y < height);
      });
    }, 50);
    return () => clearInterval(moveInterval);
  }, [spaceshipX, objects, gameOver]);

  const moveLeft = () => setSpaceshipX(Math.max(0, spaceshipX - MOVE_SPEED));
  const moveRight = () => setSpaceshipX(Math.min(width - SPACESHIP_SIZE, spaceshipX + MOVE_SPEED));
  const resetGame = () => {
    setSpaceshipX(width / 2 - SPACESHIP_SIZE / 2);
    setObjects([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      {/* Stars */}
      {stars.map((star, i) => (
        <Animated.View
          key={i}
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

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      {/* Falling objects */}
      {objects.map(obj => (
        <Image
          key={obj.key}
          source={
            obj.type === 'planet'
              ? require('../assets/planet.png')
              : require('../assets/asteroid.png')
          }
          style={[styles.object, { left: obj.x, top: obj.y }]}
        />
      ))}

      {/* Spaceship */}
      {!gameOver && (
        <Image
          source={require('../assets/spaceship.png')}
          style={[styles.spaceship, { left: spaceshipX }]}
        />
      )}

      {/* Game Over */}
      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>💥 Game Over</Text>
          <Text style={styles.finalScore}>Score: {score}</Text>
          <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
            <Text style={styles.restartText}>Restart 🚀</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Controls */}
      {!gameOver && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={moveLeft} style={styles.controlButton}>
            <Text style={styles.controlText}>◀️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={moveRight} style={styles.controlButton}>
            <Text style={styles.controlText}>▶️</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000010' },
  spaceship: { position: 'absolute', bottom: 20, width: SPACESHIP_SIZE, height: SPACESHIP_SIZE },
  object: { position: 'absolute', width: OBJECT_SIZE, height: OBJECT_SIZE },
  controls: { position: 'absolute', bottom: 80, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  controlButton: { backgroundColor: '#1E1E2F', padding: 20, borderRadius: 50 },
  controlText: { fontSize: 28, color: '#fff' },
  scoreContainer: { position: 'absolute', top: 40, left: 20 },
  scoreText: { fontSize: 24, color: '#FFD700', fontWeight: 'bold', textShadowColor: '#00FFFF', textShadowRadius: 10 },
  gameOverOverlay: { position: 'absolute', top: 0, left: 0, width, height, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  gameOverText: { fontSize: 48, color: '#FF4500', fontWeight: 'bold', marginBottom: 20 },
  finalScore: { fontSize: 28, color: '#00FF7F', marginBottom: 30 },
  restartButton: { backgroundColor: '#FFD700', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  restartText: { fontSize: 22, fontWeight: 'bold', color: '#000' },
});
