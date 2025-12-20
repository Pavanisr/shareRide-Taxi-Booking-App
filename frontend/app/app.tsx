import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "../src/api/context/AuthContext";

import StartScreen from "./start";
import LoginSelectScreen from "./Login";
import PassengerLoginScreen from "./PassengerLogin";
import DriverLoginScreen from "./DriverLogin";
import SignupScreen from "./Signup";
import ProfileScreen from "./Profile";

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  PassengerLogin: undefined;
  DriverLogin: undefined;
  Signup: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Start" component={StartScreen} />
          
          <Stack.Screen name="Login" component={LoginSelectScreen} />
          <Stack.Screen name="PassengerLogin" component={PassengerLoginScreen} />
          <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />

          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
