import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { getMechanics } from "../services/mechanicService";
import MechanicCard from "../components/MechanicCard";

export default function MechanicsDashboardScreen() {
  const [mechanics, setMechanics] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response =
        await getMechanics();

      setMechanics(response.data);

      setError("");
    } catch (error) {
      setError(
        "Failed to load mechanics. Please try again."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchMechanics(false);

    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>
          Loading Mechanics...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Mechanics Dashboard
      </Text>

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      <FlatList
        data={mechanics}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (
          <MechanicCard mechanic={item} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !error ? (
            <View
              style={styles.emptyContainer}
            >
              <Text>
                No mechanics available.
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