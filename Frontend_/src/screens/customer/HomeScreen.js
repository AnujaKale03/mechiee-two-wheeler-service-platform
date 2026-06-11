import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator,
  ScrollView, RefreshControl, TouchableOpacity, Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getServices } from "../../services/serviceService";
import ServiceCard from "../../components/ServiceCard";
import ProfileDrawer from "../customer/ProfileDrawer";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING } from "../../utils/theme";

export default function HomeScreen({ navigation }) {
  const [services, setServices]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState("");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [customerName, setCustomerName] = useState("there");

  useEffect(() => {
    fetchServices();
    loadName();
  }, []);

  const loadName = async () => {
    const raw = await AsyncStorage.getItem("customerProfile");
    if (raw) {
      const p = JSON.parse(raw);
      setCustomerName(p.name?.split(" ")[0] || "there");
    }
  };

  const fetchServices = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await getServices();
      setServices(res.data);
      setError("");
    } catch {
      setError("Failed to load services. Pull to refresh.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loaderText}>Loading…</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
        }
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Top bar */}
          <View style={styles.heroTopBar}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(!drawerOpen)} >
              <Ionicons name="menu-outline" size={26} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.heroLogoWrap}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.heroLogo}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate("Bookings")}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Text style={styles.greeting}>Good day, {customerName}! 👋</Text>
          <Text style={styles.heroTitle}>What service{"\n"}do you need today?</Text>

          {/* Stats strip */}
          <View style={styles.statsRow}>
            {[
              { num: services.length, label: "Services" },
              { num: "3",             label: "Mechanics" },
              { num: "⚡",            label: "Doorstep"  },
            ].map(({ num, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{num}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Section header ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Book Service")}>
            <Text style={styles.sectionAction}>Book now →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Error ── */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Empty ── */}
        {!error && services.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Services Available</Text>
            <Text style={styles.emptyDesc}>We're updating our catalogue. Check back soon.</Text>
          </View>
        ) : null}

        {/* ── Service cards ── */}
        {services.map((s) => <ServiceCard key={s._id} service={s} />)}

        {/* ── CTA ── */}
        {services.length > 0 && (
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate("Book Service")}
            activeOpacity={0.88}
          >
            <Ionicons name="add-circle-outline" size={20} color={COLORS.textInverse} />
            <Text style={styles.ctaText}>Book a Service Now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ── Profile Drawer ── */}
      <ProfileDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll:        { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: SPACING.xxl },
  loader:        { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg, gap: SPACING.sm },
  loaderText:    { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textMuted },

  // Hero
  hero: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.screen,
    paddingTop: 52,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heroTopBar: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: SPACING.lg,
  },
  menuBtn: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgSection,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  heroLogoWrap: {
    backgroundColor: COLORS.bgSection,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  heroLogo:  { width: 100, height: 32 },
  notifBtn: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgSection,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },

  greeting: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textMuted },
  heroTitle: {
    fontSize: FONT_SIZE.xxxl, ...FONTS.extraBold,
    color: COLORS.textPrimary, marginTop: 4, lineHeight: 36,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSection,
    borderRadius: RADIUS.lg, marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statItem:   { flex: 1, alignItems: "center" },
  statNum:    { fontSize: FONT_SIZE.lg, ...FONTS.extraBold, color: COLORS.accent },
  statLabel:  { fontSize: FONT_SIZE.xs, ...FONTS.medium, color: COLORS.textMuted, marginTop: 2 },
  statDivider:{ width: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: SPACING.screen, marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },
  sectionTitle:  { fontSize: FONT_SIZE.md, ...FONTS.bold, color: COLORS.textPrimary },
  sectionAction: { fontSize: FONT_SIZE.sm, ...FONTS.semiBold, color: COLORS.accent },

  errorBox: {
    flexDirection: "row", alignItems: "center", gap: SPACING.sm,
    marginHorizontal: SPACING.screen, marginBottom: SPACING.sm,
    padding: SPACING.md, backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.errorBorder,
  },
  errorText: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.error, flex: 1 },

  emptyBox:  { alignItems: "center", paddingVertical: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle:{ fontSize: FONT_SIZE.lg, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: { fontSize: FONT_SIZE.sm, ...FONTS.regular, color: COLORS.textMuted, textAlign: "center" },

  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.sm,
    marginHorizontal: SPACING.screen, marginTop: SPACING.md,
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md, borderRadius: RADIUS.lg, ...SHADOW.accent,
  },
  ctaText: { fontSize: FONT_SIZE.md, ...FONTS.bold, color: COLORS.textInverse },
});