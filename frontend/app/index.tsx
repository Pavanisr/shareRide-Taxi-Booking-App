import { View, Text, StyleSheet, Image, StatusBar, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const offers = [
  "🎉 Get 20% off on your first ride",
  "🚕 Ride together & save fuel costs",
  "💸 Driver bonus for peak hours",
  "🎁 Refer friends & earn coupons",
];

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const offerAnim = useRef(new Animated.Value(height)).current;
  const router = useRouter();

  useEffect(() => {
    // Splash animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Offers animation (vertical loop)
    Animated.loop(
      Animated.timing(offerAnim, {
        toValue: -height,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();

    // Auto navigate after 5 seconds
    const timer = setTimeout(() => {
      router.replace("/start");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Logo + App Name */}
      <Animated.View
        style={{
          alignItems: "center",
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={require("../assets/images/logov.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ShareRide</Text>
        <Text style={styles.subtitle}>Ride together. Save together.</Text>
      </Animated.View>

      {/* Offers Section */}
      <View style={styles.offerContainer}>
        <Animated.View
          style={{
            transform: [{ translateY: offerAnim }],
          }}
        >
          {offers.map((offer, index) => (
            <Text key={index} style={styles.offerText}>
              {offer}
            </Text>
          ))}
          {/* repeat for smooth loop */}
          {offers.map((offer, index) => (
            <Text key={`repeat-${index}`} style={styles.offerText}>
              {offer}
            </Text>
          ))}
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#E6D9F2",
  },
  offerContainer: {
    position: "absolute",
    bottom: 40,
    height: 60,
    overflow: "hidden",
  },
  offerText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    opacity: 0.9,
  },
});
