// screens/APODScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Animated,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = 300;

const NASA_API_KEY = "3aXtMTzwWLcKgoHE0CzQSgdVHLGMTBL7EofFhY8c";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function buildMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let week = new Array(7).fill(null);
  let day = 1;

  for (let i = startDay; i < 7; i++) {
    week[i] = day++;
  }
  weeks.push(week);

  while (day <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      week[i] = day++;
    }
    weeks.push(week);
  }
  return weeks;
}

export default function APODScreen() {
  const navigation = useNavigation();

  const [todayApod, setTodayApod] = useState(null);
  const [pastApods, setPastApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    loadTodayAndPast();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [todayApod]);

  const loadTodayAndPast = async () => {
    setLoading(true);
    try {
      const todayRes = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
      );
      const todayJson = await todayRes.json();

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 9);

      const startStr = isoDate(start);
      const endStr = isoDate(end);

      const rangeRes = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startStr}&end_date=${endStr}`
      );
      let rangeJson = await rangeRes.json();
      if (!Array.isArray(rangeJson)) rangeJson = [rangeJson];

      const imgs = rangeJson
        .filter((i) => i && i.media_type === "image")
        .sort((a, b) => (a.date < b.date ? 1 : -1));

      if (todayJson && todayJson.media_type === "image") {
        setTodayApod(todayJson);
      } else {
        setTodayApod(imgs[0] || null);
      }

      const heroDate =
        (todayJson && todayJson.media_type === "image" && todayJson.date) ||
        (imgs[0] && imgs[0].date) ||
        null;

      const list = imgs.filter((i) => i.date !== heroDate);
      setPastApods(list);
    } catch (e) {
      console.log("APOD load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchApodForDate = async (dateStr) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${dateStr}`
      );
      const json = await res.json();

      if (json && json.media_type === "image") {
        setTodayApod(json);

        const end = new Date(dateStr);
        const start = new Date(end);
        start.setDate(end.getDate() - 9);

        const startStr = isoDate(start);
        const endStr = isoDate(end);

        const rangeRes = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startStr}&end_date=${endStr}`
        );
        let rangeJson = await rangeRes.json();
        if (!Array.isArray(rangeJson)) rangeJson = [rangeJson];

        const imgs = rangeJson
          .filter((i) => i && i.media_type === "image")
          .sort((a, b) => (a.date < b.date ? 1 : -1));

        const list = imgs.filter((i) => i.date !== json.date);
        setPastApods(list);
      } else {
        alert("Selected date's APOD is not an image.");
      }
    } catch (e) {
      alert("Unable to load APOD.");
    } finally {
      setLoading(false);
    }
  };

  const openCalendar = () => setModalOpen(true);
  const closeCalendar = () => setModalOpen(false);

  const prevMonth = () =>
    setCalendarMonth((s) => {
      const m = s.month - 1;
      if (m < 0) return { year: s.year - 1, month: 11 };
      return { year: s.year, month: m };
    });

  const nextMonth = () =>
    setCalendarMonth((s) => {
      const m = s.month + 1;
      if (m > 11) return { year: s.year + 1, month: 0 };
      return { year: s.year, month: m };
    });

  const onPickDay = (day) => {
    if (!day) return;
    const { year, month } = calendarMonth;
    const picked = new Date(year, month, day);
    const pickedStr = isoDate(picked);
    setSelectedDate(pickedStr);
  };

  const confirmPick = () => {
    if (!selectedDate) {
      alert("Pick a date first.");
      return;
    }
    closeCalendar();
    fetchApodForDate(selectedDate);
  };

  const renderPastItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.pastCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("APODDetail", {
            title: item.title,
            description: item.explanation,
            date: item.date,
            image: item.url,
          })
        }
      >
        <Image source={{ uri: item.url }} style={styles.pastImage} />
        <Text style={styles.pastTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const weeks = buildMonthMatrix(calendarMonth.year, calendarMonth.month);
  const monthName = new Date(calendarMonth.year, calendarMonth.month).toLocaleString(undefined, { month: "long" });

  // Header content (hero + controls + section title)
  const ListHeader = (
    <Animated.View>
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <Text style={styles.title}>Astronomy Picture of the Day</Text>
        <Text style={styles.subtitle}>Featured (today or latest image)</Text>

        {loading && !todayApod ? (
          <ActivityIndicator color="#7DF9FF" size="large" style={{ marginTop: 28 }} />
        ) : todayApod ? (
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.heroCard}
            onPress={() =>
              navigation.navigate("APODDetail", {
                title: todayApod.title,
                description: todayApod.explanation,
                date: todayApod.date,
                image: todayApod.url,
              })
            }
          >
            <Image source={{ uri: todayApod.url }} style={styles.heroImage} />
            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle} numberOfLines={2}>{todayApod.title}</Text>
              <Text style={styles.heroDate}>{todayApod.date}</Text>
              <Text style={styles.heroExcerpt} numberOfLines={3}>
                {todayApod.explanation?.replace(/<[^>]*>/g, " ") || ""}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noHero}>
            <Text style={{ color: "#fff" }}>No image APOD found.</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.pickerBtn} onPress={openCalendar}>
          <Ionicons name="calendar" size={18} color="#7DF9FF" />
          <Text style={styles.pickerText}>Pick a date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pickerBtn, { backgroundColor: "rgba(255,255,255,0.04)" }]}
          onPress={loadTodayAndPast}
        >
          <Ionicons name="refresh" size={18} color="#7DF9FF" />
          <Text style={styles.pickerText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Recent APODs</Text>
    </Animated.View>
  );

  return (
    <LinearGradient colors={["#0a0220", "#15063a", "#1a094d"]} style={styles.container}>
      <StatusBar translucent barStyle="light-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#7DF9FF" />
      </TouchableOpacity>

      {/* SINGLE FlatList: header = hero+controls, data = pastApods */}
      <FlatList
        data={pastApods}
        keyExtractor={(i) => i.date}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={renderPastItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingVertical: 30 }}>
              <ActivityIndicator color="#7DF9FF" />
            </View>
          ) : (
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ color: "#fff", textAlign: "center" }}>No recent APODs available.</Text>
            </View>
          )
        }
      />

      {/* Calendar Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={prevMonth}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{monthName} {calendarMonth.year}</Text>

              <TouchableOpacity onPress={nextMonth}>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <Text key={d} style={styles.weekDayText}>{d}</Text>
              ))}
            </View>

            <View style={{ marginTop: 6 }}>
              {weeks.map((week, wi) => (
                <View key={wi} style={styles.weekRow}>
                  {week.map((day, di) => {
                    const dayStr = day
                      ? new Date(calendarMonth.year, calendarMonth.month, day)
                      : null;
                    const isSelected = dayStr && isoDate(dayStr) === selectedDate;

                    return (
                      <Pressable
                        key={di}
                        style={[styles.dayBox, isSelected && styles.dayBoxSelected]}
                        onPress={() => onPickDay(day)}
                      >
                        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                          {day || ""}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setSelectedDate(isoDate(new Date()))}>
                <Text style={styles.modalBtnText}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#7c3aed" }]} onPress={confirmPick}>
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>Load</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalBtn} onPress={closeCalendar}>
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: (StatusBar.currentHeight || 44) + 12, paddingHorizontal: 16, backgroundColor: "#03021a" },
  backButton: { marginBottom: 6, width: 40, height: 40, justifyContent: "center" },

  title: { color: "#e6f0ff", fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#bfcdf5", fontSize: 13, marginTop: 4, marginBottom: 12 },

  heroCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)"
  },
  heroImage: { width: "100%", height: HERO_HEIGHT, resizeMode: "cover" },
  heroInfo: { padding: 12 },
  heroTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  heroDate: { color: "#9fbffb", marginTop: 6, fontSize: 12 },
  heroExcerpt: { color: "#d0dbff", marginTop: 8, fontSize: 13 },

  noHero: { alignItems: "center", justifyContent: "center", height: HERO_HEIGHT },

  controls: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  pickerBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "white", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },

  sectionTitle: { color: "#cbd9ff", fontSize: 16, fontWeight: "700", marginBottom: 8 },

  pastCard: { width: (width - 48) / 2, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 12, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  pastImage: { width: "100%", height: 140 },
  pastTitle: { color: "#fff", padding: 8, fontSize: 12, fontWeight: "700" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: width - 40, backgroundColor: "#07021a", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },

  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { color: "#e6f0ff", fontWeight: "700" },

  weekDays: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  weekDayText: { color: "#9fbffb", width: (width - 72) / 7, textAlign: "center", fontSize: 12 },

  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  dayBox: { width: (width - 72) / 7, height: 36, justifyContent: "center", alignItems: "center", borderRadius: 6 },
  dayBoxSelected: { backgroundColor: "rgba(125,249,255,0.12)" },

  dayText: { color: "#dbe8ff" },
  dayTextSelected: { color: "#0d1720", fontWeight: "700" },

  modalFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.04)" },
  modalBtnText: { color: "#e6f0ff", fontWeight: "700" },
});
