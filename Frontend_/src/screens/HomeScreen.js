import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { getServices } from "../services/serviceService";
import ServiceCard from "../components/ServiceCard";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await getServices();
      setServices(response.data);
      setError("");
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Loading Services…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Good day! 👋</Text>
            <Text style={styles.heroTitle}>What service{"\n"}do you need?</Text>
          </View>
          {/* Logo in top-right of hero */}
          <View style={styles.heroLogoWrap}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.heroLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Quick stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{services.length}</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>Mechanics</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>⚡</Text>
            <Text style={styles.statLabel}>Doorstep</Text>
          </View>
        </View>
      </View>

      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Book Service")}>
          <Text style={styles.sectionAction}>Book now →</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchServices()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Empty */}
      {!error && services.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Services Available</Text>
          <Text style={styles.emptyDesc}>We're updating our catalogue. Please check back soon.</Text>
        </View>
      ) : null}

      {/* Service cards */}
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}

      {/* CTA */}
      {services.length > 0 && (
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate("Book Service")}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaText}>Book a Service Now</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: SPACING.xxl },
  loader: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg,
  },
  loaderText: { fontSize: 15, ...FONTS.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },

  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  heroGreeting: {
    fontSize: 14,
    ...FONTS.medium,
    color: COLORS.textInverseMuted,
  },
  heroTitle: {
    fontSize: 28,
    ...FONTS.extraBold,
    color: COLORS.textInverse,
    marginTop: 4,
    lineHeight: 34,
  },
  heroLogoWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    ...SHADOW.md,
  },
  heroLogo: { width: 100, height: 36 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 18, ...FONTS.extraBold, color: COLORS.textInverse },
  statLabel: { fontSize: 11, ...FONTS.medium, color: COLORS.textInverseMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.25)", marginVertical: 4 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary },
  sectionAction: { fontSize: 14, ...FONTS.semiBold, color: COLORS.primary },

  errorBox: {
    margin: SPACING.lg, padding: SPACING.md,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.errorBorder,
    alignItems: "center", gap: SPACING.sm,
  },
  errorIcon: { fontSize: 24 },
  errorText: { fontSize: 14, ...FONTS.medium, color: COLORS.error, textAlign: "center" },
  retryBtn: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    backgroundColor: COLORS.error, borderRadius: RADIUS.full,
  },
  retryText: { fontSize: 13, ...FONTS.bold, color: COLORS.textInverse },

  emptyBox: { alignItems: "center", paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: { fontSize: 14, ...FONTS.regular, color: COLORS.textSecondary, textAlign: "center", lineHeight: 21 },

  ctaBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    ...SHADOW.md,
  },
  ctaText: { fontSize: 16, ...FONTS.bold, color: COLORS.textInverse },
});