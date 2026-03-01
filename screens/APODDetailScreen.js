import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function APODDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { title, description, date, image } = route.params ?? {};

  return (
    <LinearGradient colors={["#0a0220", "#15063a", "#1a094d"]} style={styles.container}>
      <StatusBar translucent barStyle="light-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#7DF9FF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: image }} style={styles.image} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: (StatusBar.currentHeight || 44) + 16, paddingHorizontal: 16 },
  backButton: { marginBottom: 10, width: 40, height: 40, justifyContent: "center" },
  image: { width: "100%", height: 280, borderRadius: 14, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 4 },
  date: { color: "#bbb", marginBottom: 12 },
  description: { color: "#d6ddff", fontSize: 14, lineHeight: 20, marginBottom: 40 },
});
