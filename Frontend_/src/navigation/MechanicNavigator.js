// src/navigation/MechanicNavigator.js
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MechanicsDashboardScreen from "../screens/MechanicsDashboardScreen";
import AssignedBookingsScreen from "../screens/AssignedBookingsScreen";
import { COLORS } from "../utils/theme";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: ["bar-chart", "bar-chart-outline"],
  "My Jobs": ["construct", "construct-outline"],
};

export default function MechanicNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.mechanicAccent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name] || ["ellipse", "ellipse-outline"];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={MechanicsDashboardScreen} />
      <Tab.Screen name="My Jobs" component={AssignedBookingsScreen} />
    </Tab.Navigator>
  );
}