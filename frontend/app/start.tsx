import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./App";

// Define a User type
type User = {
  id: number;
  name: string;
  email: string;
  city_code: string;
  profileImage?: string; // optional
};

export default function StartScreen({ navigation }: any) {
  const scrollRef = useRef<ScrollView>(null);
  const { user, logout } = useContext(AuthContext) as { user: User | null; logout: () => void };
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

      if (position >= 300 * offers.length) position = 0; // simpler width
    }, 18);
    return () => clearInterval(interval);
  }, []);

  const handleLoginPress = () => setDropdownVisible(!dropdownVisible);
  const handleSignupPress = () => navigation.navigate("Signup");
  const handleSigninPress = () => navigation.navigate("Login");
  const handleProfilePress = () => navigation.navigate("Profile");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.loginIcon} onPress={handleLoginPress}>
          {user ? (
            <Image
              source={{
                uri: user.profileImage
                  ? `http://YOUR_SERVER/uploads/${user.profileImage}`
                  : "https://via.placeholder.com/32",
              }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          ) : (
            <Ionicons name="log-in-outline" size={28} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Dropdown when not logged in */}
        {dropdownVisible && !user && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={handleSigninPress} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignupPress} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dropdown when logged in */}
        {dropdownVisible && user && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={handleProfilePress} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

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
          <Text style={styles.cardSubtitle}>Accept rides · Earn daily income</Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            style={styles.createRideButton}
            onPress={() => Alert.alert("Search", "Search rides in your location")}
          >
            <Text style={styles.createRideText}>Search Rides in Your Location</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* OFFER TICKER */}
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
  loginIcon: { position: "absolute", top: 55, right: 20, padding: 8 },
  dropdown: {
    position: "absolute",
    top: 95,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 20 },
  dropdownText: { fontSize: 16, color: "#033c50ff" },
  appName: { fontSize: 38, fontWeight: "800", color: "#fff" },
  tagline: { marginTop: 8, fontSize: 15, color: "#EAF6FF" },
  cardContainer: { marginTop: -70, paddingHorizontal: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 26,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
  passengerCard: { borderLeftWidth: 6, borderLeftColor: "#08edf5ff" },
  driverCard: { borderLeftWidth: 6, borderLeftColor: "#f5a608ff" },
  cardTitle: { fontSize: 24, fontWeight: "800", color: "#033c50ff" },
  cardSubtitle: { marginTop: 10, fontSize: 15, color: "#6B7280", lineHeight: 22 },
  createRideButton: {
    marginTop: 10,
    backgroundColor: "#08edf5ff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    elevation: 8,
  },
  createRideText: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.5 },
  offersContainer: { position: "absolute", bottom: 18, width: "100%" },
  offerCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 10,
    elevation: 6,
  },
  offerText: { color: "#033c50ff", fontSize: 14, fontWeight: "600" },
});
