// screens/VIP/SpaceRelaxRoomScreen.js
import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated, 
  Easing 
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SpaceRelaxRoomScreen() {
  // ---------- Floating Stars ----------
  const [stars] = useState(
    Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1.5,
      opacity: new Animated.Value(Math.random()),
    }))
  );

  useEffect(() => {
    stars.forEach(star => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 0.1 + Math.random() * 0.3,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.8 + Math.random() * 0.2,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  // ---------- Floating Particles ----------
  const [particles] = useState(
    Array.from({ length: 30 }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      size: Math.random() * 4 + 2,
      opacity: new Animated.Value(Math.random() * 0.7 + 0.3),
    }))
  );

  useEffect(() => {
    particles.forEach(p => {
      const animate = () => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(p.x, { toValue: Math.random() * width, duration: 10000 + Math.random()*10000, useNativeDriver: false }),
            Animated.timing(p.y, { toValue: Math.random() * height, duration: 10000 + Math.random()*10000, useNativeDriver: false }),
          ]),
        ]).start(() => animate());
      };
      animate();
    });
  }, []);

  // ---------- Layered Nebula ----------
  const nebula1 = useRef(new Animated.Value(0)).current;
  const nebula2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(nebula1, {
        toValue: 1,
        duration: 45000,
        useNativeDriver: false,
      })
    ).start();

    Animated.loop(
      Animated.timing(nebula2, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const nebulaInterpolation1 = nebula1.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(10,0,40,0.5)', 'rgba(50,0,90,0.6)'],
  });
  const nebulaInterpolation2 = nebula2.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(20,0,50,0.4)', 'rgba(70,0,120,0.5)'],
  });

  // ---------- Breathing Circle ----------
  const circleAnim = useRef(new Animated.Value(1)).current;
  const auraAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(circleAnim, { toValue: 1.7, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(auraAnim, { toValue: 0.6, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(circleAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(auraAnim, { toValue: 0.3, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  // ---------- Ambient Music ----------
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../../assets/space-harmony-427918.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  // ---------- Timer ----------
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = (minutes) => {
    if (intervalId) clearInterval(intervalId);
    setTimer(minutes * 60);
    const id = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      {/* Nebula Layers */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: nebulaInterpolation1 }]} />
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: nebulaInterpolation2 }]} />

      {/* Floating Stars */}
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
            backgroundColor: '#fff',
            opacity: s.opacity,
          }}
        />
      ))}

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: p.y,
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: '#8c75ff',
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Breathing Circle */}
      <View style={styles.center}>
        <Animated.View style={[styles.circleAura, { opacity: auraAnim, transform: [{ scale: circleAnim }] }]} />
        <Animated.View style={[styles.circle, { transform: [{ scale: circleAnim }] }]} />
        <Text style={styles.breatheText}>Breathe</Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
        <View style={styles.timerButtons}>
          {[5,10,15].map(min => (
            <TouchableOpacity key={min} onPress={() => startTimer(min)} style={styles.timerBtn}>
              <Text style={styles.timerBtnText}>{min} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Music Control */}
      <View style={styles.musicControl}>
        <TouchableOpacity onPress={toggleMusic} style={styles.musicBtn}>
          <Ionicons 
            name={isPlaying ? 'pause-circle' : 'play-circle'} 
            size={90} 
            color="#7b5df0" 
          />
        </TouchableOpacity>
        <Text style={styles.musicText}>{isPlaying ? 'Playing Ambient Music' : 'Paused'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010018',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleAura: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(123,93,240,0.25)',
    shadowColor: '#7b5df0',
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width:0, height:0 },
    position: 'absolute',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#7b5df0',
    backgroundColor: 'rgba(123,93,240,0.2)',
    shadowColor: '#7b5df0',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  breatheText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timerBtn: {
    backgroundColor: 'rgba(123,93,240,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginHorizontal: 8,
    shadowColor: '#7b5df0',
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  timerBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  musicControl: {
    alignItems: 'center',
    marginBottom: 20,
  },
  musicBtn: {
    shadowColor: '#7b5df0',
    shadowOpacity: 0.7,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  musicText: {
    marginTop: 10,
    color: '#cbd9ff',
    fontWeight: '600',
    fontSize: 16,
  },
});
