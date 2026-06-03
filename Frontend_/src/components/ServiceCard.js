import { View, Text, StyleSheet } from "react-native";

export default function ServiceCard({ service }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>
        {service.name}
      </Text>

      <Text style={styles.price}>
        ₹{service.price}
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

  price: {
    marginTop: 5,
    color: "green",
    fontWeight: "bold",
  },
});