import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, Image,} from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

export default function RoleSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header band */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Text style={styles.brand}>Mechiee</Text>
        <Text style={styles.tagline}>Doorstep Two-Wheeler Service</Text>
      </View>

      {/* Role cards */}
      <View style={styles.body}>
        <Text style={styles.prompt}>I am a…</Text>

        <TouchableOpacity
          style={[styles.roleCard, styles.customerCard]}
          onPress={() => navigation.navigate("Customer")}
          activeOpacity={0.85}
        >
          <View style={styles.roleIconWrap}>
            <Text style={styles.roleIcon}>🏍️</Text>
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Customer</Text>
            <Text style={styles.roleDesc}>Book services, track your repairs</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.mechanicCard]}
          onPress={() => navigation.navigate("Mechanic")}
          activeOpacity={0.85}
        >
          <View style={[styles.roleIconWrap, styles.mechanicIconWrap]}>
            <Text style={styles.roleIcon}>🔧</Text>
          </View>
          <View style={styles.roleInfo}>
            <Text style={[styles.roleTitle, styles.mechanicTitle]}>
              Mechanic
            </Text>
            <Text style={styles.roleDesc}>View & manage your assignments</Text>
          </View>
          <Text style={[styles.arrow, styles.mechanicArrow]}>›</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Trusted by thousands of riders across India
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: "center",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.textInverse,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  logoText: {
    fontSize: 36,
    ...FONTS.extraBold,
    color: COLORS.primary,
  },
  brand: {
    fontSize: 34,
    ...FONTS.extraBold,
    color: COLORS.textInverse,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    ...FONTS.regular,
    color: "rgba(255,255,255,0.82)",
    marginTop: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  prompt: {
    fontSize: 18,
    ...FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  customerCard: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  mechanicCard: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.mechanicAccent,
  },
  roleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  mechanicIconWrap: {
    backgroundColor: COLORS.mechanicAccentLight,
  },
  roleIcon: {
    fontSize: 26,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.textPrimary,
  },
  mechanicTitle: {
    color: COLORS.mechanicAccent,
  },
  roleDesc: {
    fontSize: 13,
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  mechanicArrow: {
    color: COLORS.mechanicAccent,
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
});