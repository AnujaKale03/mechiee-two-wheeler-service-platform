import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity,} from "react-native";
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

  useEffect(() => {
    fetchServices();
  }, []);

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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Hero banner */}
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroGreeting}>Good day! 👋</Text>
          <Text style={styles.heroTitle}>What service{"\n"}do you need?</Text>
        </View>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeIcon}>🏍️</Text>
        </View>
      </View>

      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Book Service")}>
          <Text style={styles.sectionAction}>Book now →</Text>
        </TouchableOpacity>
      </View>

      {/* Error state */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchServices()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Empty state */}
      {!error && services.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Services Available</Text>
          <Text style={styles.emptyDesc}>
            We're updating our catalogue. Please check back soon.
          </Text>
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
  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    gap: SPACING.sm,
  },
  loaderText: {
    fontSize: 15,
    ...FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroGreeting: {
    fontSize: 15,
    ...FONTS.medium,
    color: "rgba(255,255,255,0.85)",
  },
  heroTitle: {
    fontSize: 28,
    ...FONTS.extraBold,
    color: COLORS.textInverse,
    marginTop: 4,
    lineHeight: 34,
  },
  heroBadge: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBadgeIcon: {
    fontSize: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.textPrimary,
  },
  sectionAction: {
    fontSize: 14,
    ...FONTS.semiBold,
    color: COLORS.primary,
  },
  errorBox: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md,
    alignItems: "center",
    gap: SPACING.sm,
  },
  errorIcon: { fontSize: 24 },
  errorText: {
    fontSize: 14,
    ...FONTS.medium,
    color: COLORS.error,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  retryText: {
    fontSize: 13,
    ...FONTS.bold,
    color: COLORS.textInverse,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyDesc: {
    fontSize: 14,
    ...FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  ctaBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    ...SHADOW.md,
  },
  ctaText: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.textInverse,
  },
});