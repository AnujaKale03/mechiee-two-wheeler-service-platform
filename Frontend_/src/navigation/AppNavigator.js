import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import BookServiceScreen from "../screens/BookServiceScreen";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";
import MechanicsDashboardScreen from "../screens/MechanicsDashboardScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Book Service") {
              iconName = "construct";
            } else if (route.name === "Bookings") {
              iconName = "list";
            } else if (route.name === "Mechanics") {
              iconName = "people";
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#2196F3",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Book Service"
          component={BookServiceScreen}
        />

        <Tab.Screen
          name="Bookings"
          component={BookingHistoryScreen}
        />

        <Tab.Screen
          name="Mechanics"
          component={MechanicsDashboardScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}