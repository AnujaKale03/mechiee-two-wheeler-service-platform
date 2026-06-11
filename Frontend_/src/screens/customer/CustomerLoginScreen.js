import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomerLoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (
      phone === "9999999999" &&
      password === "customer123"
    ) {
      const session = {
        id: 1,
        name: "Demo Customer",
        phone: phone,
        vehicleNumber: "MH12AB1234",
        role: "customer",
      };

      await AsyncStorage.setItem(
        "customerSession",
        JSON.stringify(session)
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "Customer" }],
      });
    } else {
      Alert.alert(
        "Login Failed",
        "Invalid phone number or password"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D0D0D"
      />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <Text style={styles.title}>Customer Login</Text>
      <Text style={styles.subtitle}>
        Access your bookings, service history and profile.
      </Text>

      {/* Phone */}
      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        style={styles.input}
        placeholder="9999999999"
        placeholderTextColor="#666"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Demo credentials */}
      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>
          Demo Credentials
        </Text>

        <Text style={styles.demoText}>
          Phone: 9999999999
        </Text>

        <Text style={styles.demoText}>
          Password: customer123
        </Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          ← Back to Role Selection
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 180,
    height: 70,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 30,
  },

  label: {
    color: "#CCCCCC",
    marginBottom: 8,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    color: "#FFFFFF",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  demoCard: {
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  demoTitle: {
    color: "#00E676",
    fontWeight: "700",
    marginBottom: 8,
  },

  demoText: {
    color: "#AAA",
    fontSize: 13,
  },

  loginButton: {
    backgroundColor: "#00E676",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  loginButtonText: {
    color: "#0D0D0D",
    fontSize: 16,
    fontWeight: "700",
  },

  backText: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
  },
});