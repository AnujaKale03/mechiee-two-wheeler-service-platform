import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

export default function RoleSelectionScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      bounces={false}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoCard}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.tagline}>Your Trusted Mechanical Service</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.prompt}>Continue as</Text>

        {/* Customer */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate("Customer")}
          activeOpacity={0.82}
        >
          <View style={[styles.roleIconWrap, { backgroundColor: COLORS.primaryFaint }]}>
            <Text style={styles.roleEmoji}>🏍️</Text>
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Customer</Text>
            <Text style={styles.roleDesc}>Book services, track your repairs</Text>
          </View>
          <View style={[styles.arrowWrap, { backgroundColor: COLORS.primaryFaint }]}>
            <Text style={[styles.arrow, { color: COLORS.primary }]}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Mechanic */}
        <TouchableOpacity
          style={[styles.roleCard, styles.mechanicCard]}
          onPress={() => navigation.navigate("Mechanic")}
          activeOpacity={0.82}
        >
          <View style={[styles.roleIconWrap, { backgroundColor: COLORS.mechanicAccentLight }]}>
            <Text style={styles.roleEmoji}>🔧</Text>
          </View>
          <View style={styles.roleInfo}>
            <Text style={[styles.roleTitle, { color: COLORS.mechanicAccent }]}>Mechanic</Text>
            <Text style={styles.roleDesc}>View & manage your assignments</Text>
          </View>
          <View style={[styles.arrowWrap, { backgroundColor: COLORS.mechanicAccentLight }]}>
            <Text style={[styles.arrow, { color: COLORS.mechanicAccent }]}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Trust badge */}
        <View style={styles.trustRow}>
          <Text style={styles.trustDot}>⭐</Text>
          <Text style={styles.trustText}>Trusted by thousands of riders across India</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1 },

  hero: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingTop: 72,
    paddingBottom: 52,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.lg,
  },
  logo: {
    width: 200,
    height: 60,
  },
  tagline: {
    fontSize: 13,
    ...FONTS.medium,
    color: COLORS.textInverseMuted,
    letterSpacing: 0.3,
  },

  body: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  prompt: {
    fontSize: 13,
    ...FONTS.semiBold,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: SPACING.md,
  },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  mechanicCard: {
    borderColor: COLORS.mechanicAccentLight,
  },

  roleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  roleEmoji: { fontSize: 26 },
  roleInfo: { flex: 1 },
  roleTitle: {
    fontSize: 17,
    ...FONTS.bold,
    color: COLORS.primary,
    marginBottom: 3,
  },
  roleDesc: {
    fontSize: 13,
    ...FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 22,
    ...FONTS.bold,
    lineHeight: 28,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
    gap: SPACING.xs,
  },
  trustDot: { fontSize: 13 },
  trustText: {
    fontSize: 13,
    ...FONTS.regular,
    color: COLORS.textMuted,
  },
});