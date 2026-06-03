import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/serviceService";
import { Image } from "react-native";

export default function HomeScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    setLoading(true);

    try {
      const response = await getServices();

      setServices(response.data);

      setError("");
    } catch (error) {

      setError(
        "Failed to load services. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading Services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Image
    source={require("../assets/app_logo_img.png")}
        style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            marginBottom: 20,
        }}
      />
      <Text style={styles.heading}>
        Welcome to Mechiee
      </Text>

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      {services.length === 0 && !error ? (
        <Text style={styles.emptyText}>
          No services available.
        </Text>
      ) : (
        services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  errorText: {
    color: "red",
    marginVertical: 10,
    fontSize: 16,
  },

  emptyText: {
    marginTop: 20,
    fontSize: 16,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});