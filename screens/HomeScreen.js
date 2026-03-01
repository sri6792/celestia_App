// screens/HomeScreen.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  // VIP status
  const [isVIP, setIsVIP] = useState(false);

  // ---------- Nebula animated values ----------
  const nebulaA = useRef(new Animated.Value(0)).current;
  const nebulaB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(nebulaA, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(nebulaA, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(nebulaB, { toValue: 1, duration: 7000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(nebulaB, { toValue: 0, duration: 7000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const nebulaAColor = nebulaA.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(14,10,38,0.20)', 'rgba(40,12,110,0.40)'],
  });
  const nebulaBColor = nebulaB.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(10,8,25,0.15)', 'rgba(120,34,180,0.30)'],
  });

  // ---------- Rocket animation ----------
  const rocket = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loopRocket = () => {
      rocket.setValue(0);
      Animated.timing(rocket, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(loopRocket, 500);
      });
    };
    loopRocket();
  }, []);
  const rocketTranslateX = rocket.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.55],
  });

  // ---------- Floating stars ----------
  const [stars] = useState(
    Array.from({ length: 20 }).map(() => ({
      x: Math.random() * (width - 20),
      y: Math.random() * 60,
      size: Math.random() * 3 + 1,
      opacity: new Animated.Value(Math.random()),
    }))
  );

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

  // ---------- Auto info slider ----------
  const infoData = [
    { id: '1', title: 'Did you know?', text: 'A day on Venus is longer than a year on Venus.' },
    { id: '2', title: 'Today in Space', text: 'Apollo 11 launched on July 16, 1969.' },
    { id: '3', title: 'Discovery', text: 'Scientists found water signatures on several exoplanets.' },
    { id: '4', title: 'Quote', text: '"Somewhere, something incredible is waiting to be known." — S. Chandrasekhar' },
  ];
  const sliderRef = useRef(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      const next = (sliderIndex + 1) % infoData.length;
      setSliderIndex(next);
      sliderRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3800);
    return () => clearInterval(iv);
  }, [sliderIndex]);

  // ---------- Cards data ----------
  let cards = [
    { key: 'explore', title: 'Explore the Cosmos', subtitle: 'Planets • Stars • Missions', Icon: () => <Ionicons name="compass" size={28} color="#6ee7f9" />, route: 'ExploreScreen' },
    { key: 'apod', title: 'Astronomy Pic of the Day', subtitle: 'Daily NASA image', Icon: () => <MaterialCommunityIcons name="image-filter-hdr" size={28} color="#a78bfa" />, route: 'APODScreen' },
    { key: 'facts', title: 'Fun Space Facts', subtitle: 'Quick cosmic trivia', Icon: () => <FontAwesome5 name="globe" size={26} color="#f472b6" />, route: 'FunFactsScreen' },
    { key: 'history', title: 'Interactive Games', subtitle: 'Play amazing games', Icon: () => <Ionicons name="game-controller" size={26} color="#fb923c" />, route: 'GameScreen' },
  ];

  if (isVIP) {
    cards.push(
      { key: 'starmap', title: 'Star Map Explorer', subtitle: 'Explore stars in your sky', Icon: () => <Ionicons name="planet" size={26} color="#7b5df0" />, route: 'StarMapExplorer' },
      { key: 'vip2', title: 'Best Day to View Sky', subtitle: 'Moon phase, ISS, meteor showers', Icon: () => <Ionicons name="moon-outline" size={26} color="#FFCC00" />, route: 'BestDaySkyScreen' },
      { key: 'vip3', title: 'Space Relaxation Room', subtitle: 'Chill ambient music & nebula', Icon: () => <Ionicons name="musical-notes-outline" size={26} color="#FF6FD8" />, route: 'SpaceRelaxRoomScreen' },
    );
  }

  function Card({ item }) {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.timing(scale, { toValue: 0.97, duration: 120, useNativeDriver: true }).start();
    };

    const onPressOut = () => {
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
        navigation.navigate(item.route);
      });
    };

    return (
      <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.cardTouchable}
        >
          <View style={[styles.cardIcon, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
            <item.Icon />
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.subtitle}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient colors={['#02021a', '#0d052a', '#120a3a']} style={StyleSheet.absoluteFill} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: nebulaAColor }]} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: nebulaBColor }]} />

      {/* Header with stars */}
      <View style={styles.headerContainer}>
        {stars.map((s, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top: s.y,
              left: s.x,
              width: s.size,
              height: s.size,
              borderRadius: s.size / 2,
              backgroundColor: '#7DF9FF',
              opacity: s.opacity,
            }}
          />
        ))}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcome}>Welcome back, Explorer</Text>
            <Text style={styles.subtitle}>Mission Control • Neon Dashboard</Text>
          </View>
          <Animated.View style={{ transform: [{ translateX: rocketTranslateX }], marginLeft: 8 }}>
            <Ionicons name="rocket" size={32} color="#7DF9FF" style={styles.rocketIcon} />
          </Animated.View>
        </View>
      </View>

      {/* Auto-info slider */}
      <View style={styles.sliderOuter}>
        <FlatList
          ref={sliderRef}
          data={infoData}
          keyExtractor={(i) => i.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.sliderCard}>
              <Text style={styles.sliderTitle}>{item.title}</Text>
              <Text style={styles.sliderText}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      {/* Unlock VIP button */}
      {!isVIP && (
        <View style={{ marginBottom: 14, alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ff4d6d',
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#ff4d6d',
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 6,
            }}
            onPress={() =>
              navigation.navigate('VIPPaymentScreen', { onPaymentSuccess: () => setIsVIP(true) })
            }
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Unlock VIP 🚀</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cards grid */}
      <View style={styles.grid}>
        <FlatList
          data={cards}
          keyExtractor={(c) => c.key}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <Card item={item} />}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0  •  NASA Space Explorer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: (StatusBar.currentHeight || 44) + 8, paddingHorizontal: 16, backgroundColor: '#03021a' },
  headerContainer: { marginBottom: 14, position: 'relative', height: 80 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  welcome: { color: '#e6f7ff', fontSize: 22, fontWeight: '800', textShadowColor: '#7DF9FF', textShadowRadius: 10 },
  subtitle: { color: '#bfcdf5', fontSize: 13, marginTop: 4, textShadowColor: '#7DF9FF', textShadowRadius: 6 },
  rocketIcon: { textShadowColor: '#7DF9FF', textShadowRadius: 12 },
  sliderOuter: { marginTop: 6, height: 86, borderRadius: 14, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', backgroundColor: 'rgba(255,255,255,0.02)' },
  sliderCard: { width: width - 32, padding: 14, justifyContent: 'center' },
  sliderTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sliderText: { color: '#d0dbff', fontSize: 13, marginTop: 6 },
  grid: { flex: 1, marginTop: 2 },
  cardWrap: { width: (width - 48) / 2, padding: 8 },
  cardTouchable: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16, alignItems: 'flex-start', minHeight: 140, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', shadowColor: '#7b5df0', shadowOpacity: 0.08, shadowRadius: 20, elevation: 8 },
  cardIcon: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardSub: { color: '#cbd9ff', fontSize: 12, marginTop: 6 },
  footer: { alignItems: 'center', paddingVertical: 14 },
  footerText: { color: '#94a3b8', fontSize: 12 },
});
