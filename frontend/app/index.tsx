import { View, Text, StyleSheet, Image, StatusBar } from "react-native";



export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={require("../assets/images/logov.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>ShareRide</Text>
      <Text style={styles.subtitle}>Ride together. Save together.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#033c50ff", // main purple
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
});
