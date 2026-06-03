import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { getBookings } from "../services/bookingService";
import BookingCard from "../components/BookingCard";

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response =
        await getBookings();

      setBookings(response.data);
      setError("");
    } catch (error) {
      setError(
        "Failed to load bookings. Please try again."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchBookings(false);

    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>
          Loading Bookings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Booking History
      </Text>

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      <FlatList
        data={bookings}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (
          <BookingCard booking={item} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !error ? (
            <View
              style={styles.emptyContainer}
            >
              <Text>
                No bookings found.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});