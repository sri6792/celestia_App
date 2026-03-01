// screens/DockingSimulatorScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const SATELLITE_SIZE = 60;
const DEBRIS_SIZE = 40;
const MOVE_SPEED = 15;
const DEBRIS_SPEED = 4;

// Generate stars
const createStars = (num) => {
  const stars = [];
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
    });
  }
  return stars;
};

export default function DockingSimulatorScreen() {
  const [satelliteX, setSatelliteX] = useState(width / 2 - SATELLITE_SIZE / 2);
  const [satelliteY, setSatelliteY] = useState(height - SATELLITE_SIZE - 20);
  const [debris, setDebris] = useState([]);
  const [score, setScore] = useState(0);
  const [docked, setDocked] = useState(false);
  const [stars] = useState(createStars(100));

  // Spawn debris
  useEffect(() => {
    if (docked) return;
    const interval = setInterval(() => {
      const x = Math.random() * (width - DEBRIS_SIZE);
      setDebris(prev => [...prev, { x, y: -DEBRIS_SIZE, key: Date.now() + Math.random() }]);
    }, 800);
    return () => clearInterval(interval);
  }, [docked]);

  // Move debris
  useEffect(() => {
    if (docked) return;
    const moveInterval = setInterval(() => {
      setDebris(prev => {
        const updated = prev.map(d => ({ ...d, y: d.y + DEBRIS_SPEED }));
        updated.forEach(d => {
          // Collision detection
          if (
            d.y + DEBRIS_SIZE >= satelliteY &&
            d.y <= satelliteY + SATELLITE_SIZE &&
            d.x + DEBRIS_SIZE >= satelliteX &&
            d.x <= satelliteX + SATELLITE_SIZE
          ) {
            setScore(prev => Math.max(prev - 5, 0));
            d.hit = true;
          }
        });
        return updated.filter(d => !d.hit && d.y < height);
      });
    }, 50);
    return () => clearInterval(moveInterval);
  }, [satelliteX, satelliteY, debris, docked]);

  // Docking detection
  const checkDocking = () => {
    const dockingZoneXStart = width / 2 - 50;
    const dockingZoneXEnd = width / 2 + 50;
    const dockingZoneYStart = 50;
    const dockingZoneYEnd = 150;
    if (
      satelliteX + SATELLITE_SIZE / 2 >= dockingZoneXStart &&
      satelliteX + SATELLITE_SIZE / 2 <= dockingZoneXEnd &&
      satelliteY + SATELLITE_SIZE / 2 >= dockingZoneYStart &&
      satelliteY + SATELLITE_SIZE / 2 <= dockingZoneYEnd
    ) {
      setDocked(true);
      setScore(prev => prev + 50);
    } else {
      alert('Missed Docking! Try Again.');
    }
  };

  // Movement controls
  const moveLeft = () => setSatelliteX(Math.max(0, satelliteX - MOVE_SPEED));
  const moveRight = () => setSatelliteX(Math.min(width - SATELLITE_SIZE, satelliteX + MOVE_SPEED));
  const moveUp = () => setSatelliteY(Math.max(0, satelliteY - MOVE_SPEED));
  const moveDown = () => setSatelliteY(Math.min(height - SATELLITE_SIZE - 20, satelliteY + MOVE_SPEED));

  const resetGame = () => {
    setSatelliteX(width / 2 - SATELLITE_SIZE / 2);
    setSatelliteY(height - SATELLITE_SIZE - 20);
    setDebris([]);
    setScore(0);
    setDocked(false);
  };

  return (
    <View style={styles.container}>
      {/* Stars */}
      {stars.map((star, i) => (
        <View key={i} style={{
          position: 'absolute',
          top: star.y,
          left: star.x,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: '#fff',
        }} />
      ))}

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      {/* Docking Station */}
      <Image
        source={require('../assets/Space__Station.png')}
        style={styles.station}
      />

     

      {/* Satellite */}
      {!docked && (
        <Image
          source={require('../assets/satellite.png')}
          style={[styles.satellite, { left: satelliteX, top: satelliteY }]}
        />
      )}

      {/* Docked Overlay */}
      {docked && (
        <View style={styles.dockedOverlay}>
          <Text style={styles.dockedText}>🛰️ Docked Successfully!</Text>
          <Text style={styles.finalScore}>Score: {score}</Text>
          <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
            <Text style={styles.restartText}>Restart 🚀</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Controls */}
      {!docked && (
        <View style={styles.controlsContainer}>
          <View style={styles.row}>
            <TouchableOpacity onPress={moveUp} style={styles.controlButton}><Text style={styles.controlText}>⬆️</Text></TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={moveLeft} style={styles.controlButton}><Text style={styles.controlText}>⬅️</Text></TouchableOpacity>
            <TouchableOpacity onPress={checkDocking} style={styles.dockButton}><Text style={styles.dockText}>Dock 🛰️</Text></TouchableOpacity>
            <TouchableOpacity onPress={moveRight} style={styles.controlButton}><Text style={styles.controlText}>➡️</Text></TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={moveDown} style={styles.controlButton}><Text style={styles.controlText}>⬇️</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000010' },
  satellite: { position: 'absolute', width: SATELLITE_SIZE, height: SATELLITE_SIZE },
  station: { position: 'absolute', top: 50, left: width / 2 - 50, width: 100, height: 100 },
  debris: { position: 'absolute', width: DEBRIS_SIZE, height: DEBRIS_SIZE },
  controlsContainer: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center', marginVertical: 5 },
  controlButton: { backgroundColor: '#1E1E2F', padding: 15, marginHorizontal: 10, borderRadius: 50 },
  controlText: { fontSize: 24, color: '#fff' },
  dockButton: { backgroundColor: '#FF4500', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 25, marginHorizontal: 10 },
  dockText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  scoreContainer: { position: 'absolute', top: 40, left: 20 },
  scoreText: { fontSize: 24, color: '#FFD700', fontWeight: 'bold', textShadowColor: '#00FFFF', textShadowRadius: 10 },
  dockedOverlay: { position: 'absolute', top: 0, left: 0, width, height, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  dockedText: { fontSize: 36, color: '#00FF7F', fontWeight: 'bold', marginBottom: 20 },
  finalScore: { fontSize: 28, color: '#FFD700', marginBottom: 30 },
  restartButton: { backgroundColor: '#FF4500', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  restartText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
});
