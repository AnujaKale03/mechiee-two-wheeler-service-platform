import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminLogin } from "../../services/authService";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../../utils/theme";

export default function AdminLoginScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    if (!password.trim()) { setError("Password required"); return; }
    setError(""); setLoading(true);
    try {
      const res = await adminLogin(password);
      await AsyncStorage.setItem("authToken", res.data.token);
      await AsyncStorage.setItem("authRole",  "admin");
      navigation.replace("AdminApp");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoCard}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.heroTitle}>Admin Portal</Text>
          <Text style={styles.heroSub}>Platform management & analytics</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Sign In</Text>
          {error ? <View style={styles.errorBox}><Text style={styles.errorText}>⚠️  {error}</Text></View> : null}
          <Text style={styles.label}>Admin Password</Text>
          <TextInput style={styles.input} placeholder="Enter password" placeholderTextColor={COLORS.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={[styles.loginBtn, loading && { opacity: 0.55 }]} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
            {loading ? <ActivityIndicator color={COLORS.textInverse} /> : <Text style={styles.loginBtnText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to role selection</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, paddingBottom: SPACING.xxl },
  hero: { backgroundColor: COLORS.adminAccentLight, alignItems: "center", paddingTop: 60, paddingBottom: SPACING.xxl, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  logoCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, marginBottom: SPACING.md, ...SHADOW.md },
  logo: { width: 160, height: 48 },
  heroTitle: { fontSize: 22, ...FONTS.extraBold, color: COLORS.adminAccent, marginTop: SPACING.sm },
  heroSub: { fontSize: 13, ...FONTS.regular, color: COLORS.textSecondary, marginTop: 4 },
  card: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, marginTop: -SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.lg, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 20, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  errorBox: { backgroundColor: COLORS.errorBg, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.errorBorder },
  errorText: { fontSize: 13, ...FONTS.medium, color: COLORS.error },
  label: { fontSize: 12, ...FONTS.semiBold, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginTop: SPACING.md, marginBottom: SPACING.xs },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, ...FONTS.medium, color: COLORS.textPrimary, backgroundColor: COLORS.bg },
  loginBtn: { marginTop: SPACING.lg, backgroundColor: COLORS.adminAccent, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", ...SHADOW.md },
  loginBtnText: { fontSize: 16, ...FONTS.bold, color: COLORS.textInverse },
  backBtn: { alignItems: "center", marginTop: SPACING.xl },
  backText: { fontSize: 14, ...FONTS.medium, color: COLORS.textMuted },
});