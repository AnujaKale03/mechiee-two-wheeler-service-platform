import { View, Text, StyleSheet } from "react-native";

export default function MechanicCard({ mechanic }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>
        {mechanic.name}
      </Text>

      <Text style={styles.count}>
        Active Bookings:
        {" "}
        {mechanic.activeBookingCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  count: {
    marginTop: 5,
    color: "#555",
  },
});