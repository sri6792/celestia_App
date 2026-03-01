// screens/VIPPaymentScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VIPPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const handlePaymentSuccess = () => {
    // Call the callback passed from HomeScreen
    if (route.params?.onPaymentSuccess) {
      route.params.onPaymentSuccess();
    }
    Alert.alert('🎉 Payment Successful!', 'VIP features unlocked.');
    navigation.goBack(); // Return to HomeScreen
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Unlock VIP Access 🚀</Text>
      <Text style={styles.subtitle}>Get access to advanced features and exclusive tools!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>VIP Plan</Text>
        <Text style={styles.cardText}>Price: RS.200 / month</Text>
        <TouchableOpacity style={styles.btn} onPress={handlePaymentSuccess}>
          <Text style={styles.btnText}>Pay & Unlock VIP</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>Note: This is a demo payment. In a real app integrate Stripe or Google/Apple in-app purchases.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#040617', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#bfcdf5', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, width: '100%', alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#cbd9ff', marginBottom: 16 },
  btn: { backgroundColor: '#ff4d6d', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  note: { color: '#94a3b8', fontSize: 12, marginTop: 16, textAlign: 'center' },
});
