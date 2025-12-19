import React, { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { AuthContext } from "./App";

type User = {
  id: number;
  name: string;
  email: string;
  city_code: string;
  profileImage?: string;
};

export default function ProfileScreen() {
  const { user } = useContext(AuthContext) as { user: User | null };

  if (!user) return <Text style={{ textAlign: "center", marginTop: 50 }}>User not logged in</Text>;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: user.profileImage
            ? `http://YOUR_SERVER/uploads/${user.profileImage}`
            : "https://via.placeholder.com/120",
        }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "800", marginBottom: 10 },
  email: { fontSize: 16, color: "#555" },
});
