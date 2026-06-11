import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getCustomers } from "../../services/adminService";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../../utils/theme";

export default function AdminCustomersScreen() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getCustomers().then(r => setCustomers(r.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.adminAccent} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <Text style={styles.subtitle}>{customers.length} registered customers</Text>
      </View>
      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item._id?.[0]?.toUpperCase()}</Text></View>
              <View style={styles.info}>
                <Text style={styles.name}>{item._id}</Text>
                <Text style={styles.meta}>{item.vehicleNumbers?.join(", ")}</Text>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.totalBookings} bookings</Text></View>
            </View>
            <Text style={styles.bikes}>🏍️  {item.bikeModels?.join(", ")}</Text>
          </View>
        )}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No customers yet.</Text></View>}
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
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.xs },
  avatar: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.adminAccentLight, alignItems: "center", justifyContent: "center", marginRight: SPACING.md },
  avatarText: { fontSize: 18, ...FONTS.bold, color: COLORS.adminAccent },
  info: { flex: 1 },
  name: { fontSize: 15, ...FONTS.bold, color: COLORS.textPrimary },
  meta: { fontSize: 12, ...FONTS.regular, color: COLORS.textSecondary, marginTop: 2 },
  badge: { backgroundColor: COLORS.adminAccentLight, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeText: { fontSize: 12, ...FONTS.semiBold, color: COLORS.adminAccent },
  bikes: { fontSize: 13, ...FONTS.regular, color: COLORS.textSecondary },
  empty: { alignItems: "center", paddingTop: SPACING.xxl },
  emptyText: { fontSize: 15, ...FONTS.medium, color: COLORS.textMuted },
});