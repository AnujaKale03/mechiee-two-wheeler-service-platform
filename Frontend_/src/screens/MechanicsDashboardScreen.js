import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,} from "react-native";
import { getMechanics } from "../services/mechanicService";
import MechanicCard from "../components/MechanicCard";
import { COLORS, FONTS, RADIUS, SPACING } from "../utils/theme";

export default function MechanicsDashboardScreen() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMechanics();
  }, []);

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Team Dashboard</Text>
        <Text style={styles.subtitle}>Today's mechanic availability</Text>
        {/* Summary row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNum}>{total}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxGreen]}>
            <Text style={[styles.summaryNum, { color: COLORS.success }]}>{available}</Text>
            <Text style={styles.summaryLabel}>Available</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxRed]}>
            <Text style={[styles.summaryNum, { color: COLORS.error }]}>{total - available}</Text>
            <Text style={styles.summaryLabel}>Full</Text>
          </View>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
          <TouchableOpacity onPress={() => fetchMechanics()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* List */}
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
              <Text style={styles.emptyDesc}>No mechanics are registered yet.</Text>
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
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: COLORS.bg,
  },
  loaderText: { fontSize: 15, ...FONTS.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },
  header: {
    backgroundColor: COLORS.mechanicAccent,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: { fontSize: 28, ...FONTS.extraBold, color: COLORS.textInverse },
  subtitle: { fontSize: 14, ...FONTS.regular, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  summaryRow: {
    flexDirection: "row",
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  summaryBoxGreen: { backgroundColor: "rgba(22,163,74,0.18)" },
  summaryBoxRed: { backgroundColor: "rgba(220,38,38,0.18)" },
  summaryNum: { fontSize: 26, ...FONTS.extraBold, color: COLORS.textInverse },
  summaryLabel: { fontSize: 12, ...FONTS.medium, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  errorBox: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: { fontSize: 13, ...FONTS.medium, color: COLORS.error, flex: 1 },
  retryText: { fontSize: 13, ...FONTS.bold, color: COLORS.mechanicAccent },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, paddingTop: SPACING.sm },
  emptyBox: { alignItems: "center", paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: { fontSize: 14, ...FONTS.regular, color: COLORS.textSecondary, textAlign: "center" },
});