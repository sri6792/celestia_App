// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }

      setLoading(false);
    } catch (err) {
      alert("Failed to load profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#7DF9FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <StatusBar barStyle="light-content" />

      {/* ---------- Profile Header ---------- */}
      <View style={styles.headerContainer}>
        <View style={[styles.iconContainer, userData?.isVIP && { borderColor: '#FFD700' }]}>
          <Ionicons
            name="person-circle-outline"
            size={95}
            color={userData?.isVIP ? "#FFD700" : "#7DF9FF"}
          />
        </View>

        <Text style={styles.name}>{userData?.name}</Text>
        <Text style={styles.username}>@{userData?.username}</Text>
        <Text style={styles.email}>{userData?.email}</Text>

        {userData?.isVIP ? (
          <Text style={styles.vipBadge}>🌌 VIP Explorer</Text>
        ) : (
          <Text style={styles.notVip}>Not a VIP user</Text>
        )}

        {/* Edit Profile */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("EditProfileScreen")}
        >
          <Text style={styles.editText}>Edit Profile ✏️</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- About Card ---------- */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardText}>
          NASA Space Explorer helps you track missions, explore space, and learn more about the cosmos.
        </Text>
      </View>

      {/* ---------- Logout Button ---------- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.small}>Version 1.0 • NASA Space Explorer</Text>
      </View>
    </ScrollView>
  );
}

// -------------------------------------------------------
// Styles
// -------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040617',
    paddingHorizontal: 16,
  },

  loadingWrap: {
    flex: 1,
    backgroundColor: '#040617',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---------- Header Section ---------- */
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#7DF9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  username: {
    color: '#bfcdf5',
    fontSize: 14,
    marginTop: 2,
  },
  email: {
    color: '#d0d8ff',
    fontSize: 13,
    marginTop: 2,
  },

  vipBadge: {
    marginTop: 8,
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 16,
  },
  notVip: {
    marginTop: 8,
    color: '#FF6FD8',
    fontSize: 14,
    fontWeight: '600',
  },

  editBtn: {
    backgroundColor: '#7b5df0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 14,
  },
  editText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  /* ---------- About Card ---------- */
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 14,
    marginBottom: 22,
  },

  cardTitle: {
    color: '#7DF9FF',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  cardText: {
    color: '#c9d1ee',
    fontSize: 13,
    lineHeight: 18,
  },

  /* ---------- Logout Button ---------- */
  logoutBtn: {
    backgroundColor: '#ff4d6d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  /* ---------- Footer ---------- */
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  small: {
    color: '#9aa3cf',
    fontSize: 12,
  },
});
