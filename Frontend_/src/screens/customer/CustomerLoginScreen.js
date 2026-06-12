import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Image, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { sendOtp } from "../../services/authService";

export default function CustomerLoginScreen({ navigation }) {
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const isValid = /^[6-9]\d{9}$/.test(phone);

  const handleSendOtp = async () => {
    if (!isValid) { setError("Enter a valid 10-digit Indian mobile number"); return; }
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone, "customer");
      navigation.navigate("OtpVerify", { phone, role: "customer" });
    } catch (err) {
      setError(err?.response?.data?.message || "Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Customer Login</Text>
      <Text style={styles.subtitle}>Enter your mobile number to receive an OTP</Text>

      {/* Phone input */}
      <Text style={styles.label}>Phone Number</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <View style={styles.countryCode}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.dialCode}>+91</Text>
        </View>
        <View style={styles.divider} />
        <TextInput
          style={styles.phoneInput}
          value={phone}
          onChangeText={t => { setPhone(t.replace(/\D/g, "")); setError(""); }}
          placeholder="98765 43210"
          placeholderTextColor="#555"
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
          onSubmitEditing={handleSendOtp}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.termsText}>
        By continuing, you agree to Mechiee's Terms of Service and Privacy Policy
      </Text>

      <TouchableOpacity
        style={[styles.loginButton, (!isValid || loading) && styles.btnDisabled]}
        onPress={handleSendOtp}
        disabled={!isValid || loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#0D0D0D" />
          : <Text style={styles.loginButtonText}>Send OTP</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Role Selection</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#0D0D0D", paddingHorizontal: 24, justifyContent: "center" },
  logoContainer:  { alignItems: "center", marginBottom: 40 },
  logo:           { width: 180, height: 70 },
  title:          { color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 },
  subtitle:       { color: "#888", fontSize: 14, marginBottom: 30, lineHeight: 20 },
  label:          { color: "#CCCCCC", marginBottom: 8, fontSize: 14 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#1A1A1A", borderRadius: 12,
    borderWidth: 1, borderColor: "#2A2A2A",
    height: 56, marginBottom: 8,
  },
  inputError:    { borderColor: "#F43F5E" },
  countryCode:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 6 },
  flag:          { fontSize: 18 },
  dialCode:      { fontSize: 15, color: "#FFFFFF", fontWeight: "500" },
  divider:       { width: 1, height: 28, backgroundColor: "#2A2A2A" },
  phoneInput:    { flex: 1, color: "#FFFFFF", fontSize: 17, paddingHorizontal: 14, letterSpacing: 1 },
  errorText:     { color: "#F43F5E", fontSize: 13, marginBottom: 12 },
  termsText:     { fontSize: 12, color: "#555", lineHeight: 18, marginBottom: 28 },
  loginButton:   { backgroundColor: "#00E676", height: 56, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  btnDisabled:   { opacity: 0.45 },
  loginButtonText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
  backText:      { textAlign: "center", color: "#777", fontSize: 14 },
});