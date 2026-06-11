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

import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
  SHADOW,
  SPACING,
} from "../utils/theme";


const ROLES = [
  {
    key: "Customer",
    emoji: "🏍️",
    title: "Customer",
    desc: "Book services and track repairs",
    accent: COLORS.primary,
    bg: COLORS.primaryLight,
  },
  {
    key: "Mechanic",
    emoji: "🔧",
    title: "Mechanic",
    desc: "Manage assigned jobs and earnings",
    accent: COLORS.mechanicAccent,
    bg: COLORS.mechanicAccentLight,
  },
  {
    key: "Admin",
    emoji: "⚙️",
    title: "Administrator",
    desc: "Monitor platform operations",
    accent: COLORS.adminAccent,
    bg: COLORS.adminAccentLight,
  },
];

export default function RoleSelectionScreen({ navigation }) {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            Choose how you want to continue
          </Text>

          <Text style={styles.subtitle}>
            Select your account type to access Mechiee services
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsContainer}>
          {ROLES.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={styles.card}
              activeOpacity={0.85}
onPress={() => {
  switch (role.key) {
    case "Customer":
      navigation.navigate("CustomerLoginScreen");
      break;

    case "Mechanic":
      navigation.navigate("MechanicLoginScreen");
      break;

    case "Admin":
      navigation.navigate("AdminLoginScreen");
      break;

    default:
      break;
  }
}}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: role.bg },
                ]}
              >
                <Text style={styles.icon}>
                  {role.emoji}
                </Text>
              </View>

              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: role.accent },
                  ]}
                >
                  {role.title}
                </Text>

                <Text style={styles.cardDescription}>
                  {role.desc}
                </Text>
              </View>

              <View
                style={[
                  styles.arrowContainer,
                  { backgroundColor: role.accent },
                ]}
              >
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Trusted by riders and mechanics across India
          </Text>
        </View>
      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingBottom: 100,
  },

  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  logo: {
    width: 180,
    height: 70,
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    textAlign: "center",
    ...FONTS.bold,
  },

  subtitle: {
    marginTop: SPACING.sm,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    lineHeight: 22,
  },

  cardsContainer: {
    paddingHorizontal: SPACING.lg,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 28,
  },

  cardContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  cardTitle: {
    fontSize: FONT_SIZE.lg,
    ...FONTS.bold,
  },

  cardDescription: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },

  arrowContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    color: COLORS.textInverse,
    fontSize: 22,
    ...FONTS.bold,
  },

  footer: {
    marginTop: SPACING.xl,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },

  footerText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
});