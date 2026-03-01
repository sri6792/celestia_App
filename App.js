// App.js
// Expo + React Native: Animated Welcome Screen with Twinkling Stars Background

import GettingStartedScreen from './screens/GettingStartedScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { LogBox } from 'react-native';
import MainTabs from './screens/MainTabs'; 
import ExploreScreen from './screens/ExploreScreen';
import APODScreen from './screens/APODScreen';
import ExploreDetailScreen from './screens/ExploreDetailScreen';
import APODDetailScreen from "./screens/APODDetailScreen";
import FunFactsScreen from "./screens/FunFactsScreen";
import GameScreen from "./screens/GameScreen";
import DockingSimulatorScreen from './screens/DockingSimulatorScreen';
import PlanetCatcherScreen from './screens/PlanetCatcherScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import VIPPaymentScreen from './screens/VIPPaymentScreen';
import StarMapExplorerScreen from './screens/VIP/StarMapExplorerScreen';
import BestDaySkyScreen from './screens/VIP/BestDaySkyScreen';
import SpaceRelaxRoomScreen from './screens/VIP/SpaceRelaxRoomScreen';
LogBox.ignoreLogs(['Setting a timer']); 
const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

// Twinkling star component
function Star({ left, top, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => loop());
    };
    loop();
  }, []);

  return <Animated.View style={[styles.star, { left, top, opacity }]} />;
}

function StarBackground() {
  // Randomly generate star positions
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
}

function WelcomeScreen({ navigation }) {
  const logoY = useRef(new Animated.Value(40)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoY, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(buttonsOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#0f172a", "#0b1140", "#06102b"]} style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <StarBackground />

      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoY }], opacity: logoOpacity }]}>
        <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>NASA Space Explorer</Text>
        <Text style={styles.tag}>Discover missions, images & space data</Text>
      </Animated.View>

      <Animated.View style={[styles.ctaContainer, { opacity: buttonsOpacity }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('GettingStarted')}>
          <Text style={styles.secondaryText}>Explore as Guest</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}></Text>
      </View>
    </LinearGradient>
  );
}

function GettingStarted({ navigation }) {
  return (
    <View style={styles.gettingContainer}>
      <Text style={styles.gsTitle}>Welcome to NASA Space Explorer</Text>
      <Text style={styles.gsText}>
        This demo app will use public APIs (NASA) and Firebase Auth.\n
        Screens planned: Splash, Welcome, Onboarding, Auth (SignUp/Login), Home (missions & images), Profile & Admin.
      </Text>

      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 20 }]} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.primaryText}>Back to Splash</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator screenOptions={{ headerShown: false }}>

  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  <Stack.Screen name="Signup" component={SignupScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="GettingStarted" component={GettingStartedScreen} />

  <Stack.Screen name="MainTabs" component={MainTabs} />

  <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
  <Stack.Screen name="APODScreen" component={APODScreen} />
  <Stack.Screen 
    name="ExploreDetail" 
    component={ExploreDetailScreen}
    options={{ headerShown: false }}
  />

  <Stack.Screen 
    name="APODDetail" 
    component={APODDetailScreen}
    options={{ headerShown: false }}
  />
  <Stack.Screen
  name="FunFactsScreen"
  component={FunFactsScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen name="DockingSimulator" component={DockingSimulatorScreen} />
<Stack.Screen name="GameScreen" component={GameScreen} />
<Stack.Screen name="PlanetCatcher" component={PlanetCatcherScreen} />
<Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
<Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
<Stack.Screen name="VIPPaymentScreen" component={VIPPaymentScreen} />
 <Stack.Screen name="StarMapExplorer" component={StarMapExplorerScreen} />
 <Stack.Screen 
  name="BestDaySkyScreen" 
  component={BestDaySkyScreen} 
  options={{ title: 'Best Day to View Sky', headerShown: true }}
/>
<Stack.Screen
  name="SpaceRelaxRoomScreen"
  component={SpaceRelaxRoomScreen}
  options={{ title: 'Space Relaxation Room', headerShown: true }}
/>
</Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 18,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tag: {
    color: '#cbd5e1',
    marginTop: 6,
    textAlign: 'center',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    paddingHorizontal: 24,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: { color: '#fff', opacity: 0.9 },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: { color: '#94a3b8', fontSize: 12 },
  gettingContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#071021',
  },
  gsTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  gsText: { color: '#cbd5e1', lineHeight: 20, textAlign: 'center' },
});
