import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getWaitlisted } from "../../services/adminService";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../../utils/theme";

export default function AdminWaitlistedScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getWaitlisted().then(r => setBookings(r.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.adminAccent} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waitlisted</Text>
        <Text style={styles.subtitle}>{bookings.length} waiting — oldest assigned first</Text>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.id}>#{item._id.slice(-6).toUpperCase()}</Text>
              <View style={styles.waitBadge}><Text style={styles.waitBadgeText}>⏳ Waitlisted</Text></View>
            </View>
            <Text style={styles.customer}>{item.customerName}</Text>
            <Text style={styles.detail}>🏍️  {item.bikeModel}  ·  {item.vehicleNumber}</Text>
            <Text style={styles.detail}>🔧  {item.serviceId?.name}  ·  ₹{item.serviceId?.price}</Text>
            <Text style={styles.date}>Submitted: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>No waitlisted bookings!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: COLORS.adminAccentLight, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.xxl, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  title: { fontSize: 26, ...FONTS.extraBold, color: COLORS.adminAccent },
  subtitle: { fontSize: 13, ...FONTS.regular, color: COLORS.textSecondary, marginTop: 3 },
  list: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.xxl },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.errorBorder, borderLeftWidth: 4, borderLeftColor: COLORS.error },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.xs },
  id: { fontSize: 12, ...FONTS.bold, color: COLORS.textMuted, letterSpacing: 1 },
  waitBadge: { backgroundColor: COLORS.errorBg, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  waitBadgeText: { fontSize: 11, ...FONTS.bold, color: COLORS.error },
  customer: { fontSize: 16, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: 4 },
  detail: { fontSize: 13, ...FONTS.regular, color: COLORS.textSecondary, marginBottom: 2 },
  date: { fontSize: 11, ...FONTS.regular, color: COLORS.textMuted, marginTop: SPACING.xs },
  empty: { alignItems: "center", paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: 16, ...FONTS.semiBold, color: COLORS.success },
});