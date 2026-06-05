import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

const SERVICE_ICONS = {
  "Standard Service": "🔩",
  "Premium Service": "⭐",
  "Engine Repair": "⚙️",
};

export default function ServiceCard({ service }) {
  const icon = SERVICE_ICONS[service.name] || "🔧";

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.desc}>Professional doorstep service</Text>
      </View>
      <View style={styles.priceTag}>
        <Text style={styles.price}>₹{service.price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  icon: { fontSize: 22 },
  info: { flex: 1 },
  name: { fontSize: 15, ...FONTS.bold, color: COLORS.textPrimary },
  desc: { fontSize: 12, ...FONTS.regular, color: COLORS.textSecondary, marginTop: 2 },
  priceTag: {
    backgroundColor: COLORS.primaryFaint,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  price: { fontSize: 15, ...FONTS.extraBold, color: COLORS.primary },
});