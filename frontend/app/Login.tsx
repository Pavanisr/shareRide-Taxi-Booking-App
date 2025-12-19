// LoginScreen.tsx
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AuthContext } from "./context/AuthContext"; // make sure path is correct
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./app"; // your app.tsx types
import { useNavigation } from "@react-navigation/native";
import { passengerLogin } from "./api"; // import your api.ts helper

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    try {
      const data = await passengerLogin(email, password); // call api.ts function
      login(data.user, data.token); // save user & token in AuthContext
      navigation.replace("Start");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F4F6FA" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#08edf5ff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: "#055c66ff", fontWeight: "600", textAlign: "center", marginTop: 5 },
});
