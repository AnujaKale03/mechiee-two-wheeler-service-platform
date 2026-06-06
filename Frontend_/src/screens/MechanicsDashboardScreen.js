import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity, Image,
} from "react-native";
import { getMechanics } from "../services/mechanicService";
import MechanicCard from "../components/MechanicCard";
import { COLORS, FONTS, RADIUS, SPACING } from "../utils/theme";

export default function MechanicsDashboardScreen() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchMechanics(); }, []);

  const fetchMechanics = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await getMechanics();
      setMechanics(response.data);
      setError("");
    } catch {
      setError("Failed to load mechanics. Please try again.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMechanics(false);
    setRefreshing(false);
  };

  const available = mechanics.filter((m) => m.isAvailable).length;
  const total = mechanics.length;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.mechanicAccent} />
        <Text style={styles.loaderText}>Loading Dashboard…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Logo top-right */}
        <View style={styles.headerTop}>
          <Text style={styles.title}>Team Dashboard</Text>
          <View style={styles.logoWrap}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.subtitle}>Today's mechanic availability</Text>

        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { num: total,           label: "Total",     color: COLORS.textInverse,  bg: "rgba(255,255,255,0.15)" },
            { num: available,       label: "Available", color: COLORS.success,      bg: "rgba(5,150,105,0.22)" },
            { num: total-available, label: "Full",      color: COLORS.error,        bg: "rgba(220,38,38,0.22)" },
          ].map(({ num, label, color, bg }) => (
            <View key={label} style={[styles.summaryBox, { backgroundColor: bg }]}>
              <Text style={[styles.summaryNum, { color }]}>{num}</Text>
              <Text style={styles.summaryLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
          <TouchableOpacity onPress={() => fetchMechanics()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={mechanics}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <MechanicCard mechanic={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>👷</Text>
              <Text style={styles.emptyTitle}>No Mechanics Found</Text>
              <Text style={styles.emptyDesc}>No mechanics registered yet.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loader: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg,
  },
  loaderText: { fontSize: 15, ...FONTS.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },

  header: {
    backgroundColor: COLORS.mechanicAccent,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: { fontSize: 26, ...FONTS.extraBold, color: COLORS.textInverse },
  logoWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  logo: { width: 90, height: 30 },
  subtitle: { fontSize: 13, ...FONTS.regular, color: COLORS.textInverseMuted, marginBottom: SPACING.lg },

  summaryRow: { flexDirection: "row", gap: SPACING.sm },
  summaryBox: {
    flex: 1, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, alignItems: "center",
  },
  summaryNum: { fontSize: 26, ...FONTS.extraBold },
  summaryLabel: { fontSize: 12, ...FONTS.medium, color: COLORS.textInverseMuted, marginTop: 2 },

  errorBox: {
    margin: SPACING.lg, padding: SPACING.md,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.md,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  errorText: { fontSize: 13, ...FONTS.medium, color: COLORS.error, flex: 1 },
  retryText: { fontSize: 13, ...FONTS.bold, color: COLORS.mechanicAccent },

  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, paddingTop: SPACING.sm },
  emptyBox: { alignItems: "center", paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: { fontSize: 14, ...FONTS.regular, color: COLORS.textSecondary, textAlign: "center" },
});