import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, RefreshControl, TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../services/api";
import MechanicCard from "../../components/MechanicCard";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from "../../utils/theme";

export default function MechanicsScreen() {
  const [mechanics, setMechanics] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState("");

  const fetchMechanics = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError("");
    try {
      const res = await API.get("/mechanics");
      setMechanics(res.data);
    } catch (err) {
      setError("Failed to load mechanics. Pull to refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMechanics(); }, [fetchMechanics]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMechanics(false);
  };

  const available = mechanics.filter(m => m.isAvailable).length;
  const busy      = mechanics.length - available;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.mechanicAccent} />
        <Text style={styles.loadingText}>Loading mechanics…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mechanics</Text>
        <Text style={styles.headerSub}>{mechanics.length} total</Text>
      </View>

      {/* Stats strip */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: COLORS.success }]}>{available}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: COLORS.error }]}>{busy}</Text>
          <Text style={styles.statLabel}>Fully Booked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: COLORS.mechanicAccent }]}>{mechanics.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
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
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.mechanicAccent}
          />
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🔧</Text>
              <Text style={styles.emptyTitle}>No mechanics found</Text>
              <Text style={styles.emptySub}>Add mechanics via the seed data or admin panel.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.bg },
  centered:    { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, backgroundColor: COLORS.bg },
  loadingText: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textMuted },

  header: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 52,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: FONT_SIZE.xl, ...FONTS.bold, color: COLORS.textPrimary },
  headerSub:   { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textMuted },

  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.screen,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  statItem:    { flex: 1, alignItems: "center" },
  statNum:     { fontSize: FONT_SIZE.lg, ...FONTS.extraBold },
  statLabel:   { fontSize: FONT_SIZE.xs, ...FONTS.medium, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: SPACING.screen, marginBottom: SPACING.md,
    padding: SPACING.md, backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.errorBorder,
  },
  errorText:  { flex: 1, fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.error },
  retryText:  { fontSize: FONT_SIZE.sm, ...FONTS.bold, color: COLORS.mechanicAccent },

  list: { paddingHorizontal: SPACING.screen, paddingBottom: SPACING.xxl },

  emptyBox:  { alignItems: "center", paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle:{ fontSize: FONT_SIZE.lg, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: 6 },
  emptySub:  { fontSize: FONT_SIZE.sm, ...FONTS.regular, color: COLORS.textMuted, textAlign: "center" },
});