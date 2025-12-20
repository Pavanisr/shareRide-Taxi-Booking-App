// ProfileScreen.tsx
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { AuthContext } from "../src/api/context/AuthContext";
import { passengerEditProfile, passengerDeleteProfile } from "../src/api/api";

export default function ProfileScreen() {
  const { user, token, logout} = useContext(AuthContext);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImageUrl(`http://192.168.1.9:5000/uploads/${user.profileImage}`);
    }
  }, [user]);

  const handleDeleteProfile = async () => {
    try {
      await passengerDeleteProfile(token!);
      Alert.alert("Profile Deleted", "Your profile has been deleted.");
      logout();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {profileImageUrl && <Image source={{ uri: profileImageUrl }} style={styles.image} />}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#ff4d4d" }]} onPress={handleDeleteProfile}>
        <Text style={styles.buttonText}>Delete Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F6FA", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 5 },
  email: { fontSize: 16, color: "#6B7280", marginBottom: 20 },
  button: { backgroundColor: "#08edf5ff", padding: 12, borderRadius: 12, width: "60%", alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
