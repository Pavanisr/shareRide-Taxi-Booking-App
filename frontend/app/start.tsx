// StartScreen.tsx
import React, { useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./app";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BASE_URL } from "./api"; // ✅ USE API FILE ONLY

const { width } = Dimensions.get("window");

export default function StartScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const offers = [
    "🎉 50% OFF First Ride",
    "🚕 Share rides & save money",
    "💰 Earn more with peak hours",
    "🎁 Coupon: SHARE10",
    "⚡ Fast & safe rides",
  ];

  useEffect(() => {
    let position = 0;
    const interval = setInterval(() => {
      position += 1;
      scrollRef.current?.scrollTo({ x: position, animated: false });
      if (position >= width * offers.length) position = 0;
    }, 18);

    return () => clearInterval(interval);
  }, []);

  const handleProfilePress = () => {
    if (!user) {
      Alert.alert("Account", undefined, [
        { text: "Sign In", onPress: () => navigation.navigate("Login") },
        { text: "Sign Up", onPress: () => navigation.navigate("Signup") },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      Alert.alert("Profile", undefined, [
        { text: "Profile", onPress: () => navigation.navigate("Profile") },
        { text: "Logout", onPress: logout },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
          {user?.profileImage ? (
            <Image
              source={{ uri: `${BASE_URL}/uploads/${user.profileImage}` }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="log-in-outline" size={28} color="#fff" />
          )}
        </TouchableOpacity>

        <Text style={styles.appName}>ShareRide</Text>
        <Text style={styles.tagline}>Ride together. Save together.</Text>
      </LinearGradient>

      {/* CARDS */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={[styles.card, styles.passengerCard]}>
          <Text style={styles.cardTitle}>Passenger</Text>
          <Text style={styles.cardSubtitle}>
            Find rides · Join rides · Save money
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.driverCard]}>
          <Text style={styles.cardTitle}>Driver</Text>
          <Text style={styles.cardSubtitle}>
            Accept rides · Earn daily income
          </Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity style={styles.createRideButton}>
            <Text style={styles.createRideText}>Search Rides</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* OFFERS TICKER */}
      <View style={styles.offersContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          {[...offers, ...offers].map((offer, index) => (
            <View key={index} style={styles.offerCard}>
              <Text style={styles.offerText}>{offer}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },

  header: {
    height: 260,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },

  profileIcon: {
    position: "absolute",
    top: 55,
    right: 20,
    padding: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  profileImage: { width: 32, height: 32, borderRadius: 16 },

  appName: { fontSize: 38, fontWeight: "800", color: "#fff" },
  tagline: { marginTop: 8, fontSize: 15, color: "#EAF6FF" },

  cardContainer: { marginTop: -70, paddingHorizontal: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 26,
    marginBottom: 22,
    elevation: 10,
  },

  passengerCard: { borderLeftWidth: 6, borderLeftColor: "#08edf5ff" },
  driverCard: { borderLeftWidth: 6, borderLeftColor: "#f5a608ff" },

  cardTitle: { fontSize: 24, fontWeight: "800", color: "#033c50ff" },
  cardSubtitle: { marginTop: 10, fontSize: 15, color: "#6B7280" },

  createRideButton: {
    marginTop: 10,
    backgroundColor: "#08edf5ff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  createRideText: { color: "#fff", fontSize: 17, fontWeight: "800" },

  offersContainer: {
    position: "absolute",
    bottom: 18,
    width: "100%",
  },

  offerCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 10,
    elevation: 6,
  },

  offerText: {
    color: "#033c50ff",
    fontSize: 14,
    fontWeight: "600",
  },
});
