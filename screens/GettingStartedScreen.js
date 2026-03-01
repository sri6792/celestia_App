import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 1,
    title: 'Discover the Universe',
    text: 'Explore stunning NASA imagery, missions, and cosmic wonders from across the galaxy.',
    image: require('../assets/slide1.jpg'),
    gradient: ['#0f172a', '#1e3a8a', '#1e40af'],
  },
  {
    key: 2,
    title: 'Stay Updated',
    text: 'Track live missions, planetary movements, and cosmic events in real-time.',
    image: require('../assets/slide2.jpg'),
    gradient: ['#0b1140', '#312e81', '#1e3a8a'],
  },
  {
    key: 3,
    title: 'Join the Community',
    text: 'Connect with fellow space explorers and share your interstellar discoveries.',
    image: require('../assets/slide3.jpg'),
    gradient: ['#06102b', '#0b1140', '#1e3a8a'],
  },
];

const Star = ({ left, top, delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ]).start(() => loop());
    };
    loop();
  }, []);

  return <Animated.View style={[styles.star, { left, top, opacity }]} />;
};

const StarBackground = () => {
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    key: i,
    left: Math.random() * width,
    top: Math.random() * height,
    delay: Math.random() * 2000,
  }));
  return (
    <View style={StyleSheet.absoluteFill}>
      {stars.map((s) => (
        <Star key={s.key} left={s.left} top={s.top} delay={s.delay} />
      ))}
    </View>
  );
};

const GettingStartedScreen = () => {
  const navigation = useNavigation();

  return (
    <Swiper
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
      showsButtons={false}
    >
      {slides.map((slide, index) => (
        <LinearGradient
          key={slide.key}
          colors={slide.gradient}
          style={styles.slide}
        >
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <StarBackground />

          <Animated.View style={styles.contentContainer}>
            <Image
              source={slide.image}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>

            {index === slides.length - 1 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </LinearGradient>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#d1d5db',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#2563eb',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'white',
  },
});

export default GettingStartedScreen;
