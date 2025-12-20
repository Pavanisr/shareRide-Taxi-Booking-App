import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { AuthContext } from "../src/api/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./app";
import { passengerLogin } from "../src/api/api";
import { Ionicons } from "@expo/vector-icons";

// Import local Google icon
const googleIcon = require("../assets/images/google.png");

export default function PassengerLoginScreen() {
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
      const data = await passengerLogin(email, password);
      login(data.user, data.token);
      navigation.replace("start");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  const handleSocialLogin = (type: "google" | "facebook") => {
    Alert.alert("Social Login", `Login with ${type} coming soon!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Login</Text>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
  placeholder="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  style={styles.input}
  placeholderTextColor="#888" // <-- your desired color
/>

      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        {/* Google */}
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc" }]}
          onPress={() => handleSocialLogin("google")}
        >
          <Image source={googleIcon} style={styles.socialIcon} />
          <Text style={[styles.socialButtonText, { color: "#000" }]}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
          onPress={() => handleSocialLogin("facebook")}
        >
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: "#F4F6FA" },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 30, color: "#333", textAlign: "center" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: { padding: 10 },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#ff7f00",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  loginButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  orText: { textAlign: "center", marginVertical: 15, fontSize: 14, color: "#666" },
  socialContainer: { marginBottom: 20 },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  socialIcon: { width: 20, height: 20, marginRight: 10, resizeMode: "contain" },
  socialButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { color: "#055c66ff", fontWeight: "600", textAlign: "center", marginTop: 10, fontSize: 14 },
});
