// screens/SignupScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignupScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore user profile
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        vip: false,
        createdAt: new Date(),
        photoURL: null
      });

      // Reset navigation so user cannot go back to Login page
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });

    } catch (error) {
      console.log("Signup error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80' }}
      style={styles.background}
      blurRadius={2}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[
              styles.container,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Space Explorer community 🚀</Text>

            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.signupText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>
                Already have an account? <Text style={styles.linkHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  container: {
    width: '85%',
    backgroundColor: 'rgba(0, 0, 20, 0.7)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#00f',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 10, textAlign: 'center', letterSpacing: 1 },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 30, textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  signupButton: {
    backgroundColor: '#4b6cb7',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4b6cb7',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  signupText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  loginLink: { color: '#ccc', marginTop: 25, fontSize: 14 },
  linkHighlight: { color: '#4b6cb7', fontWeight: '600' },
});

export default SignupScreen;
