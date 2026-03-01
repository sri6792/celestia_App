// screens/ExploreDetailScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export default function ExploreDetailScreen({ route, navigation }) {
  const { title, description, image } = route.params;

  const [imageModal, setImageModal] = useState(false);

  // CLEAN DESCRIPTION
  const cleanDescription = (text) => {
    if (!text) return "No description available.";

    let cleaned = text.replace(/<[^>]*>/g, " ");

    cleaned = cleaned
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'");

    cleaned = cleaned
      .replace(/Follow us on[\s\S]*/gi, "")
      .replace(/Find us on[\s\S]*/gi, "")
      .replace(/Like us on[\s\S]*/gi, "")
      .replace(/Read more:[\s\S]*/gi, "");

    return cleaned.replace(/\s+/g, " ").trim();
  };

  const cleanText = cleanDescription(description);

  // ---------- DOWNLOAD IMAGE ----------
  const downloadImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow gallery permission.");
        return;
      }

      // Safe filename
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const fileUri = FileSystem.documentDirectory + `${safeTitle}.jpg`;

      const downloadResult = await FileSystem.downloadAsync(image, fileUri);

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync("SpaceExplorer", asset, false);

      Alert.alert("Downloaded!", "Image saved to your gallery.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not download the image.");
    }
  };

  // ---------- SHARE IMAGE ----------
  const shareImage = async () => {
    try {
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const fileUri = FileSystem.cacheDirectory + `${safeTitle}.jpg`;

      await FileSystem.downloadAsync(image, fileUri);

      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Share NASA Image",
        mimeType: "image/jpeg",
        UTI: "image/jpeg",
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not share the image.");
    }
  };

  return (
    <LinearGradient
      colors={["#060114", "#0c0430", "#12074a"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={26} color="#7DF9FF" />
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Image */}
        <TouchableOpacity onPress={() => setImageModal(true)}>
          <Image source={{ uri: image }} style={styles.mainImage} />
        </TouchableOpacity>

        <Text style={styles.tapToZoom}>Tap image to zoom</Text>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={downloadImage}>
            <Ionicons name="download-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={shareImage}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{cleanText}</Text>
        </View>
      </ScrollView>

      {/* FULLSCREEN IMAGE MODAL */}
      <Modal visible={imageModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModal(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <Image source={{ uri: image }} style={styles.fullImage} />
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (StatusBar.currentHeight || 44) + 10,
    paddingHorizontal: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E8ECFF",
    marginBottom: 12,
    lineHeight: 30,
  },

  mainImage: {
    width: "100%",
    height: 280,
    borderRadius: 14,
    marginBottom: 6,
  },

  tapToZoom: {
    color: "#b8c7ff",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },

  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  descriptionBox: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  sectionTitle: {
    color: "#9bb6ff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  descriptionText: {
    color: "#dbe3ff",
    fontSize: 14,
    lineHeight: 20,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "95%",
    height: "80%",
    borderRadius: 12,
    resizeMode: "contain",
  },

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
