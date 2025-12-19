import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get("window");

export default function Start() {
  const scrollRef = useRef<ScrollView>(null);

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

      if (position >= width * offers.length) {
        position = 0;
      }
    }, 18);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.loginIcon}>
          <Ionicons name="log-in-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.appName}>ShareRide</Text>
        <Text style={styles.tagline}>Ride together. Save together.</Text>
      </LinearGradient>

      {/* MAIN CARDS */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={[styles.card, styles.passengerCard]}>
          <Ionicons name="person" size={28} color="#08edf5ff" />
          <Text style={styles.cardTitle}>Passenger</Text>
          <Text style={styles.cardSubtitle}>
            Find rides · Join · Save money
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.driverCard]}>
          <Ionicons name="car-sport" size={28} color="#f5a608ff" />
          <Text style={styles.cardTitle}>Driver</Text>
          <Text style={styles.cardSubtitle}>
            Accept rides · Earn money
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createRideButton}
          onPress={() => Alert.alert("Notice", "Please login or signup")}
        >
          <Text style={styles.createRideText}>Create a Ride</Text>
        </TouchableOpacity>
      </View>

      {/* PROMO TICKER */}
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
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  header: {
    height: 260,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },

  loginIcon: {
    position: "absolute",
    top: 55,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 14,
  },

  appName: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: "#EAF6FF",
  },

  /* ⬆️ MOVED UP MORE */
  cardContainer: {
    marginTop: -70,
    paddingHorizontal: 20,
  },

  /* 📦 BIGGER CARDS */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 28,
    marginBottom: 22,
    elevation: 10,
  },

  passengerCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#08edf5ff",
  },

  driverCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#f5a608ff",
  },

  cardTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "700",
    color: "#033c50ff",
  },

  cardSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 20,
  },

  /* PRIMARY CTA */
  createRideButton: {
    marginTop: 26,
    backgroundColor: "#08edf5ff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    elevation: 6,
  },

  createRideText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  /* PROMO */
  offersContainer: {
    position: "absolute",
    bottom: 22,
    width: "100%",
  },

  offerCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 22,
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
