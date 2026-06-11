import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "../../services/adminService";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../../utils/theme";

export default function AdminDashboardScreen({ navigation }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { const res = await getAnalytics(); setData(res.data); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["authToken", "authRole"]);
    navigation.replace("RoleSelection");
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.adminAccent} /></View>;

  const stats = [
    { label: "Total Bookings",  value: data?.totalBookings,  color: COLORS.adminAccent,  bg: COLORS.adminAccentLight },
    { label: "Today",           value: data?.todayBookings,  color: COLORS.info,          bg: COLORS.infoBg          },
    { label: "Completed",       value: data?.completed,      color: COLORS.success,       bg: COLORS.successBg       },
    { label: "In Progress",     value: data?.inProgress,     color: COLORS.warning,       bg: COLORS.warningBg       },
    { label: "Waitlisted",      value: data?.waitlisted,     color: COLORS.error,         bg: COLORS.errorBg         },
    { label: "Cancelled",       value: data?.cancelled,      color: COLORS.textMuted,     bg: COLORS.surfaceAlt      },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Platform overview</Text>
        <View style={styles.revRow}>
          <Text style={styles.revLabel}>Total Revenue</Text>
          <Text style={styles.revValue}>₹{data?.totalRevenue?.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {stats.map(({ label, value, color, bg }) => (
          <View key={label} style={[styles.statCard, { backgroundColor: bg }]}>
            <Text style={[styles.statNum, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        {[
          { label: "👥  View Customers",          screen: "AdminCustomers"  },
          { label: "🔧  View Mechanics",           screen: "AdminMechanics"  },
          { label: "⏳  Waitlisted Bookings",      screen: "AdminWaitlisted" },
        ].map(({ label, screen }) => (
          <TouchableOpacity key={screen} style={styles.actionRow} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.actionText}>{label}</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingBottom: SPACING.xxl },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: COLORS.adminAccentLight, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.xxl, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  title: { fontSize: 26, ...FONTS.extraBold, color: COLORS.adminAccent },
  subtitle: { fontSize: 13, ...FONTS.regular, color: COLORS.textSecondary, marginTop: 3 },
  revRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: SPACING.md, backgroundColor: "rgba(59,46,128,0.1)", borderRadius: RADIUS.md, padding: SPACING.md },
  revLabel: { fontSize: 14, ...FONTS.semiBold, color: COLORS.adminAccent },
  revValue: { fontSize: 22, ...FONTS.extraBold, color: COLORS.adminAccent },
  grid: { flexDirection: "row", flexWrap: "wrap", padding: SPACING.md, gap: SPACING.sm, marginTop: -SPACING.md },
  statCard: { width: "47%", borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  statNum: { fontSize: 28, ...FONTS.extraBold },
  statLabel: { fontSize: 12, ...FONTS.medium, color: COLORS.textSecondary, marginTop: 3 },
  card: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, marginTop: SPACING.sm, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 15, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  actionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  actionText: { fontSize: 14, ...FONTS.medium, color: COLORS.textPrimary },
  actionArrow: { fontSize: 20, color: COLORS.adminAccent, ...FONTS.bold },
  logoutBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.lg, backgroundColor: COLORS.errorBg, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", borderWidth: 1, borderColor: COLORS.errorBorder },
  logoutText: { fontSize: 15, ...FONTS.bold, color: COLORS.error },
});