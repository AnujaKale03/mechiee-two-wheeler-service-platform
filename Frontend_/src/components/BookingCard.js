import { View, Text, StyleSheet } from "react-native";

export default function BookingCard({ booking }) {
  return (
    <View style={styles.card}>
      <Text style={styles.id}>
        Booking ID: {booking._id.substring(0, 6)}
      </Text>

      <Text>
        Service: {booking.serviceId?.name || "N/A"}
      </Text>

      <Text>
        Mechanic: {booking.mechanicId?.name || "Not Assigned"}
      </Text>

      <Text
        style={[
          styles.status,
          booking.status === "WAITLISTED"
            ? styles.waitlisted
            : styles.assigned,
        ]}
      >
        Status: {booking.status}
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

  id: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  status: {
    marginTop: 5,
    fontWeight: "bold",
  },

  assigned: {
    color: "green",
  },

  waitlisted: {
    color: "red",
  },
});