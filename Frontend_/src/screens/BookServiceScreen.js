import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

import { getServices } from "../services/serviceService";
import { createBooking } from "../services/bookingService";
import { BOOKING_STATUS } from "../utils/constants";

export default function BookServiceScreen() {
  const [customerName, setCustomerName] = useState("");
  const [bikeModel, setBikeModel] = useState("");

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();

      setServices(response.data);

      if (response.data.length > 0) {
        setSelectedService(response.data[0]._id);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2:
          "Unable to load services. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (services.length === 0) {
      Toast.show({
        type: "error",
        text1: "No Services Available",
        text2: "Please try again later.",
      });
      return;
    }

    if (customerName.trim().length < 3) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2:
          "Customer name must be at least 3 characters",
      });
      return;
    }

    if (bikeModel.trim().length < 2) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Bike model is too short",
      });
      return;
    }

    if (!selectedService) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select a service",
      });
      return;
    }

    try {
      const response = await createBooking({
        customerName,
        bikeModel,
        serviceId: selectedService,
      });

      const { status, message } = response.data;

      Toast.show({
        type:
          status === BOOKING_STATUS.WAITLISTED
            ? "error"
            : "success",
        text1:
          status === BOOKING_STATUS.WAITLISTED
            ? "Waitlisted"
            : "Booking Successful",
        text2: message,
      });

      setCustomerName("");
      setBikeModel("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2:
          error?.response?.data?.message ||
          "Unable to create booking. Please try again.",
      });
    }
  };

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
      <Text style={styles.heading}>
        Book Service
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <TextInput
        style={styles.input}
        placeholder="Bike Model"
        value={bikeModel}
        onChangeText={setBikeModel}
      />

      <Text style={styles.label}>
        Select Service
      </Text>

      {services.length === 0 ? (
        <Text style={styles.emptyText}>
          No services available
        </Text>
      ) : (
        <Picker
          selectedValue={selectedService}
          onValueChange={(value) =>
            setSelectedService(value)
          }
        >
          {services.map((service) => (
            <Picker.Item
              key={service._id}
              label={`${service.name} - ₹${service.price}`}
              value={service._id}
            />
          ))}
        </Picker>
      )}

      <Button
        title="Submit Booking"
        onPress={handleBooking}
        disabled={services.length === 0}
      />
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
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },

  label: {
    marginBottom: 10,
    fontWeight: "bold",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
});