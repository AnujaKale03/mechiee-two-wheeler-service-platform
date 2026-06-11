import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyProfile } from "../../services/mechanicService";
import { getMechanicImage } from "../../utils/mechanicImages";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../../utils/theme";

export default function MechanicProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["authToken", "authUser", "authRole"]);
    navigation.replace("RoleSelection");
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.mechanicAccent} /></View>;

  const image = getMechanicImage(profile?.name);
  const pct   = Math.min(((profile?.todayBookingCount || 0) / (profile?.maxCapacity || 3)) * 100, 100);
  const barColor = pct >= 100 ? COLORS.error : pct >= 67 ? COLORS.warning : COLORS.success;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(profile?.avgRating || 0) ? "★" : "☆");

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {image
          ? <Image source={image} style={styles.avatar} resizeMode="cover" />
          : <View style={styles.avatarFallback}><Text style={styles.avatarText}>{profile?.name?.[0] ?? "M"}</Text></View>
        }
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.role}>Certified Mechanic</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>{stars.join("")}</Text>
          <Text style={styles.ratingNum}>{(profile?.avgRating || 0).toFixed(1)} ({profile?.totalRatings || 0} reviews)</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { num: profile?.totalCompleted || 0,      label: "Completed" },
          { num: profile?.todayBookingCount || 0,   label: "Today" },
          { num: profile?.maxCapacity || 3,         label: "Max/Day" },
        ].map(({ num, label }) => (
          <View key={label} style={styles.statBox}>
            <Text style={styles.statNum}>{num}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Today's capacity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Capacity</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.barLabel}>{profile?.todayBookingCount}/{profile?.maxCapacity} bookings · {Math.round(pct)}%</Text>
      </View>

      {/* Today's bookings */}
      {profile?.todayBookings?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Jobs</Text>
          {profile.todayBookings.map((b) => (
            <View key={b._id} style={styles.jobRow}>
              <Text style={styles.jobName}>{b.customerName}</Text>
              <Text style={styles.jobService}>{b.serviceId?.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: b.status === "COMPLETED" ? COLORS.success : COLORS.warning }]} />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingBottom: SPACING.xxl },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: COLORS.mechanicAccentPastel, alignItems: "center", paddingTop: SPACING.xl, paddingBottom: SPACING.xxl, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  avatar: { width: 96, height: 96, borderRadius: RADIUS.full, borderWidth: 3, borderColor: COLORS.surface, ...SHADOW.md },
  avatarFallback: { width: 96, height: 96, borderRadius: RADIUS.full, backgroundColor: COLORS.mechanicAccentLight, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: COLORS.surface },
  avatarText: { fontSize: 40, ...FONTS.bold, color: COLORS.mechanicAccent },
  name: { fontSize: 24, ...FONTS.extraBold, color: COLORS.textOnMechanic, marginTop: SPACING.md },
  role: { fontSize: 13, ...FONTS.medium, color: COLORS.textOnMechanicMuted, marginTop: 3 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.sm, gap: SPACING.sm },
  stars: { fontSize: 18, color: COLORS.warning },
  ratingNum: { fontSize: 13, ...FONTS.medium, color: COLORS.textOnMechanicMuted },
  statsRow: { flexDirection: "row", marginHorizontal: SPACING.lg, marginTop: -SPACING.md, gap: SPACING.sm },
  statBox: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: "center", ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  statNum: { fontSize: 24, ...FONTS.extraBold, color: COLORS.mechanicAccent },
  statLabel: { fontSize: 12, ...FONTS.medium, color: COLORS.textMuted, marginTop: 2 },
  card: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, marginTop: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 15, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  barTrack: { height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: RADIUS.full },
  barLabel: { fontSize: 12, ...FONTS.regular, color: COLORS.textMuted, marginTop: SPACING.xs },
  jobRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  jobName: { flex: 1, fontSize: 14, ...FONTS.semiBold, color: COLORS.textPrimary },
  jobService: { fontSize: 12, ...FONTS.regular, color: COLORS.textSecondary, marginRight: SPACING.sm },
  statusDot: { width: 8, height: 8, borderRadius: RADIUS.full },
  logoutBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.lg, backgroundColor: COLORS.errorBg, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", borderWidth: 1, borderColor: COLORS.errorBorder },
  logoutText: { fontSize: 15, ...FONTS.bold, color: COLORS.error },
});