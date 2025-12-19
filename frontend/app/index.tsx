import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const offers = [
    "🎉 20% OFF First Ride",
    "🚕 Share rides & save money",
    "💰 Driver peak bonuses",
    "🎁 Refer friends & earn",
    "⚡ Fast & safe rides",
  ];

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

    startScroll();

    setTimeout(() => {
      router.replace("/start");
    }, 5000);
  }, []);

  const startScroll = () => {
    translateX.setValue(0);
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -width,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <LinearGradient
      colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Logo */}
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
        />
        <Text style={styles.title}>ShareRide</Text>
        <Text style={styles.subtitle}>Ride together. Save together.</Text>
      </Animated.View>

      {/* 🔥 Offers Section */}
      <View style={styles.offersContainer}>
        <Animated.View
          style={[
            styles.offersRow,
            { transform: [{ translateX }] },
          ]}
        >
          {[...offers, ...offers].map((offer, index) => (
            <View key={index} style={styles.offerCard}>
              <Text style={styles.offerText}>{offer}</Text>
            </View>
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
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#E6D9F2",
  },

  /* OFFERS */
  offersContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    overflow: "hidden",
  },

  offersRow: {
    flexDirection: "row",
  },

  offerCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginHorizontal: 10,
    elevation: 6,
  },

  offerText: {
    color: "#033c50ff",
    fontSize: 14,
    fontWeight: "600",
  },
});
