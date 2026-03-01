// screens/PrivacyScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';

export default function PrivacyScreen() {
  const [dataSharing, setDataSharing] = useState(true);
  const [appPermissions, setAppPermissions] = useState(true);

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirect to password change flow.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Privacy & Security</Text>

      {/* Change Password */}
      <TouchableOpacity style={styles.card} onPress={handleChangePassword}>
        <Text style={styles.cardTitle}>Change Password</Text>
        <Text style={styles.cardText}>Update your account password securely.</Text>
      </TouchableOpacity>

      {/* Data Sharing */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Sharing</Text>
        <Text style={styles.cardText}>Allow NASA Space Explorer to share your data anonymously for app improvements.</Text>
        <Switch
          value={dataSharing}
          onValueChange={setDataSharing}
          trackColor={{ false: '#555', true: '#7DF9FF' }}
          thumbColor={dataSharing ? '#fff' : '#ccc'}
        />
      </View>

      {/* App Permissions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Permissions</Text>
        <Text style={styles.cardText}>Control which features of your device the app can access.</Text>
        <Switch
          value={appPermissions}
          onValueChange={setAppPermissions}
          trackColor={{ false: '#555', true: '#7DF9FF' }}
          thumbColor={appPermissions ? '#fff' : '#ccc'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040617', padding: 16 },

  title: { fontSize: 22, fontWeight: '700', color: '#7DF9FF', marginBottom: 24 },

  card: { backgroundColor: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 14, marginBottom: 16 },
  cardTitle: { color: '#7DF9FF', fontWeight: '700', fontSize: 16, marginBottom: 6 },
  cardText: { color: '#c9d1ee', fontSize: 13, marginBottom: 12 },
});
