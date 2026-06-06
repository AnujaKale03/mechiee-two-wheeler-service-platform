import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";
import { getMechanicImage } from "../utils/mechanicImages";

export default function MechanicCard({ mechanic }) {
  const max = mechanic.maxCapacity || 3;
  const count = mechanic.todayBookingCount ?? 0;
  const pct = Math.min((count / max) * 100, 100);
  const isAvailable = count < max;

  const barColor =
    pct >= 100 ? COLORS.error : pct >= 67 ? COLORS.warning : COLORS.success;

  const image = getMechanicImage(mechanic.name);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Avatar — photo if available, initials fallback */}
        <View style={styles.avatarWrap}>
          {image ? (
            <Image source={image} style={styles.avatarImg} resizeMode="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {mechanic.name?.[0] ?? "M"}
              </Text>
            </View>
          )}
          {/* Online dot */}
          <View style={[styles.onlineDot, { backgroundColor: isAvailable ? COLORS.success : COLORS.error }]} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{mechanic.name}</Text>
          <View style={[styles.availBadge, {
            backgroundColor: isAvailable ? COLORS.successBg : COLORS.errorBg,
            borderColor: isAvailable ? COLORS.successBorder : COLORS.errorBorder,
          }]}>
            <Text style={[styles.availText, { color: isAvailable ? COLORS.success : COLORS.error }]}>
              {isAvailable ? "● Available" : "● Fully Booked"}
            </Text>
          </View>
        </View>

        {/* Count badge */}
        <View style={styles.countWrap}>
          <Text style={[styles.countNum, { color: barColor }]}>{count}</Text>
          <Text style={styles.countMax}>/{max}</Text>
        </View>
      </View>

      {/* Capacity bar */}
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.barFooter}>
        <Text style={styles.barLabel}>Today's bookings</Text>
        <Text style={[styles.barPct, { color: barColor }]}>{Math.round(pct)}% capacity</Text>
      </View>
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
    position: "relative",
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.mechanicAccentLight,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mechanicAccentLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.mechanicAccent,
  },
  avatarInitial: { fontSize: 22, ...FONTS.bold, color: COLORS.mechanicAccent },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },

  info: { flex: 1 },
  name: { fontSize: 16, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: 5 },
  availBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  availText: { fontSize: 12, ...FONTS.semiBold },

  countWrap: { flexDirection: "row", alignItems: "baseline" },
  countNum: { fontSize: 28, ...FONTS.extraBold },
  countMax: { fontSize: 14, ...FONTS.medium, color: COLORS.textMuted },

  barTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: RADIUS.full },
  barFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.xs,
  },
  barLabel: { fontSize: 12, ...FONTS.regular, color: COLORS.textMuted },
  barPct: { fontSize: 12, ...FONTS.semiBold },
});