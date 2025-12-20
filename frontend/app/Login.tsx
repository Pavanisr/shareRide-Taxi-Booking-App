import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./app";

export default function LoginSelectScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={["#08edf5ff", "#76b1f5ff", "#055c66ff"]}
      style={styles.container}
    >
      <Text style={styles.title}>Login as</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("PassengerLogin")}
      >
        <Ionicons name="person-outline" size={32} color="#08edf5ff" />
        <Text style={styles.cardText}>Passenger</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("DriverLogin")}
      >
        <Ionicons name="car-outline" size={32} color="#f5a608ff" />
        <Text style={styles.cardText}>Driver</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
    color: "#033c50ff",
  },
});
