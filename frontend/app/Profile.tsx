import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AuthContext } from "./context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user?.profileImage && <Image source={{ uri: `http://YOUR_SERVER/uploads/${user.profileImage}` }} style={styles.image} />}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F6FA" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700" },
  email: { fontSize: 16, color: "#6B7280", marginBottom: 20 },
  button: { backgroundColor: "#08edf5ff", padding: 12, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
