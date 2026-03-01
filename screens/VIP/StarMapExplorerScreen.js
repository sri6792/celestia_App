// screens/VIP/StarMapExplorerScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CENTER_X = width / 2;
const CENTER_Y = height / 3;

export default function StarMapExplorerScreen() {
  const [location, setLocation] = useState(null);
  const [issPos, setIssPos] = useState({ lat: 0, lon: 0 });
  const [stars, setStars] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [angle, setAngle] = useState(0);

  const angleAnim = useRef(new Animated.Value(0)).current;

  // Generate stars randomly
  useEffect(() => {
    const s = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height / 2,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setStars(s);
  }, []);

  // Simulate visible planets
  useEffect(() => {
    const p = [
      { name: 'Mercury', angleOffset: 0 },
      { name: 'Venus', angleOffset: 45 },
      { name: 'Mars', angleOffset: 90 },
      { name: 'Jupiter', angleOffset: 135 },
      { name: 'Saturn', angleOffset: 180 },
    ];
    setPlanets(p);

    // Animate rotation
    Animated.loop(
      Animated.timing(angleAnim, {
        toValue: 360,
        duration: 60000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  // Fetch location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location required for Star Map features');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Fetch ISS position every 5 seconds
  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await res.json();
        const { latitude, longitude } = data.iss_position;
        setIssPos({ lat: parseFloat(latitude), lon: parseFloat(longitude) });
      } catch (err) {
        console.log('ISS fetch error', err);
      }
    };
    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  // Map latitude/longitude to screen coordinates (simplified)
  const mapCoord = (lat, lon) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((-lat + 90) / 180) * (height / 2);
    return { x, y };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌌 Star Map Explorer</Text>

      <Svg height={height / 2} width={width} style={{ marginTop: 20 }}>
        {/* Twinkling stars */}
        {stars.map((s, i) => (
          <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.opacity} />
        ))}

        {/* Planets orbit */}
        {planets.map((p, i) => {
          const orbitRadius = 40 + i * 30;
          const rot = angleAnim.interpolate({
            inputRange: [0, 360],
            outputRange: [0 + p.angleOffset, 360 + p.angleOffset],
          });
          const theta = (angle + p.angleOffset) * (Math.PI / 180);
          const x = CENTER_X + orbitRadius * Math.cos(theta);
          const y = CENTER_Y + orbitRadius * Math.sin(theta);
          return (
            <Circle key={i} cx={x} cy={y} r={6} fill="#ffdf6c">
              <SvgText fill="#fff" fontSize="10" x={x + 8} y={y + 4}>
                {p.name}
              </SvgText>
            </Circle>
          );
        })}

        {/* ISS */}
        <Circle
          cx={mapCoord(issPos.lat, issPos.lon).x}
          cy={mapCoord(issPos.lat, issPos.lon).y}
          r={8}
          fill="#00ffff"
        />
        <SvgText
          fill="#00ffff"
          fontSize="12"
          x={mapCoord(issPos.lat, issPos.lon).x + 10}
          y={mapCoord(issPos.lat, issPos.lon).y + 4}
        >
          ISS
        </SvgText>
      </Svg>

      {/* Action buttons */}
      <View style={{ width: '100%', marginTop: 30 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#7b5df0' }]}
          onPress={() => Alert.alert('ISS Tracker', `Latitude: ${issPos.lat}\nLongitude: ${issPos.lon}`)}
        >
          <Ionicons name="rocket" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Track ISS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f472b6' }]}
          onPress={() => Alert.alert('Visible Planets', planets.map(p => p.name).join(', '))}
        >
          <MaterialCommunityIcons name="planet" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Visible Planets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#06b6d4' }]}
          onPress={() => Alert.alert('Night Sky', 'Sky is clear tonight!')}
        >
          <FontAwesome5 name="moon" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Night Sky Guidance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#040617',
    minHeight: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
