import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

export default function MechanicCard({ mechanic }) {
  const max = mechanic.maxCapacity || 3;
  const count = mechanic.todayBookingCount ?? 0;
  const pct = Math.min((count / max) * 100, 100);
  const isAvailable = mechanic.isAvailable !== false && count < max;

  const barColor =
    pct >= 100 ? COLORS.error : pct >= 67 ? COLORS.warning : COLORS.success;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{mechanic.name?.[0] ?? "M"}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{mechanic.name}</Text>
          <View style={[styles.availBadge, { backgroundColor: isAvailable ? COLORS.successBg : COLORS.errorBg }]}>
            <Text style={[styles.availText, { color: isAvailable ? COLORS.success : COLORS.error }]}>
              {isAvailable ? "● Available" : "● Fully Booked"}
            </Text>
          </View>
        </View>
        <View style={styles.countWrap}>
          <Text style={[styles.countNum, { color: barColor }]}>{count}</Text>
          <Text style={styles.countMax}>/ {max}</Text>
        </View>
      </View>

      {/* Capacity bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.barLabel}>
        Today's capacity: {count}/{max} active bookings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mechanicAccentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  avatarText: { fontSize: 20, ...FONTS.bold, color: COLORS.mechanicAccent },
  info: { flex: 1 },
  name: { fontSize: 16, ...FONTS.bold, color: COLORS.textPrimary },
  availBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: 4,
  },
  availText: { fontSize: 12, ...FONTS.semiBold },
  countWrap: { flexDirection: "row", alignItems: "baseline" },
  countNum: { fontSize: 26, ...FONTS.extraBold },
  countMax: { fontSize: 14, ...FONTS.medium, color: COLORS.textMuted },
  barBg: {
    height: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: RADIUS.full },
  barLabel: {
    fontSize: 12,
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});