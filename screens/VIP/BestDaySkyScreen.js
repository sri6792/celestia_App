// screens/VIP/BestDaySkyScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function BestDaySkyScreen() {
  const [location, setLocation] = useState(null);
  const [cloudCover, setCloudCover] = useState(0);
  const [moonPhase, setMoonPhase] = useState(0);
  const [lightPollution, setLightPollution] = useState('Moderate');

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Fetch location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required for best sky info.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchSkyData(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  const fetchSkyData = async (lat, lon) => {
    // Dummy data for now, can integrate weather API / NASA EONET later
    setCloudCover(Math.floor(Math.random() * 100));
    setMoonPhase(Math.random());
    const lightLevels = ['Low', 'Moderate', 'High'];
    setLightPollution(lightLevels[Math.floor(Math.random() * 3)]);
  };

  const moonPhaseText = () => {
    if (moonPhase < 0.25) return 'New Moon';
    if (moonPhase < 0.5) return 'First Quarter';
    if (moonPhase < 0.75) return 'Full Moon';
    return 'Last Quarter';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#02021a', '#0a043c']} style={StyleSheet.absoluteFill} />

      <Text style={styles.title}>🌠 Best Day to View Sky</Text>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Ionicons name="cloud-outline" size={32} color="#7DF9FF" />
        <Text style={styles.cardTitle}>Cloud Cover</Text>
        <Text style={styles.cardValue}>{cloudCover}%</Text>
      </Animated.View>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <FontAwesome5 name="moon" size={32} color="#f9f871" />
        <Text style={styles.cardTitle}>Moon Phase</Text>
        <Text style={styles.cardValue}>{moonPhaseText()}</Text>
      </Animated.View>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="#f472b6" />
        <Text style={styles.cardTitle}>Light Pollution</Text>
        <Text style={styles.cardValue}>{lightPollution}</Text>
      </Animated.View>

      <View style={{ marginTop: 30, width: '100%' }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#7b5df0' }]}
          onPress={() => Alert.alert('Cosmic Event', 'ISS passing tonight at 21:30!')}
        >
          <Ionicons name="rocket" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Cosmic Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#06b6d4' }]}
          onPress={() => Alert.alert('View Direction', 'Best viewing direction: NE')}
        >
          <FontAwesome5 name="compass" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Best Direction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    width: width - 40,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#7DF9FF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardTitle: {
    color: '#cbd9ff',
    fontSize: 16,
    marginTop: 8,
  },
  cardValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
