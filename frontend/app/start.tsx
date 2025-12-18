import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

const { height } = Dimensions.get("window");

export default function Start() {
  const scrollAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -100, // scroll out of view
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const offers = ["50% Off on first ride", "Get 2 rides free", "Coupon: SHARE10", "Weekend Special Discount"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Login Icon */}
        <TouchableOpacity style={styles.loginIcon}>
          <Ionicons name="log-in-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.appName}>ShareRide</Text>
        <Text style={styles.tagline}>Ride together. Save together.</Text>
      </LinearGradient>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {/* Passenger */}
        <TouchableOpacity style={[styles.card, styles.passengerCard]}>
          <Text style={styles.cardTitle}>Passenger</Text>
          <Text style={styles.cardSubtitle}>
            Find rides · Join · Save money
          </Text>
        </TouchableOpacity>

        {/* Driver */}
        <TouchableOpacity style={[styles.card, styles.driverCard]}>
          <Text style={styles.cardTitle}>Driver</Text>
          <Text style={styles.cardSubtitle}>
            Accept rides · Earn money
          </Text>
        </TouchableOpacity>

        {/* Create Ride Button */}
        <TouchableOpacity
          style={styles.createRideButton}
          onPress={() => Alert.alert("Notice", "Please login or signup")}
        >
          <Text style={styles.createRideText}>Create Ride</Text>
        </TouchableOpacity>
      </View>

      {/* Scrolling Offers */}
      <View style={styles.offersContainer}>
        <Animated.View style={{ transform: [{ translateY: scrollAnim }] }}>
          {offers.map((offer, index) => (
            <Text key={index} style={styles.offerText}>
              {offer}
            </Text>
          ))}
        </Animated.View>
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
    height: 230,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    position: "relative",
  },
  loginIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: "#EAF6FF",
  },
  cardContainer: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  passengerCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#08edf5ff",
  },
  driverCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#f5a608ff",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#033c50ff",
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  createRideButton: {
    marginTop: 20,
    backgroundColor: "#08edf5ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createRideText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  offersContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
    height: 50,
  },
  offerText: {
    fontSize: 16,
    color: "#08edf5ff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
