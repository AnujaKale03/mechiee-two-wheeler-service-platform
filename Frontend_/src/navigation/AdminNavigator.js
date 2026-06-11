import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AdminDashboardScreen  from "../screens/admin/DashboardScreen";
import AdminCustomersScreen  from "../screens/admin/CustomersScreen";
import AdminMechanicsScreen  from "../screens/admin/MechanicsScreen";
import AdminWaitlistedScreen from "../screens/admin/WaitlistedScreen";
import { COLORS } from "../utils/theme";

const Tab = createBottomTabNavigator();
const ICONS = {
  Dashboard:   ["bar-chart","bar-chart-outline"],
  Customers:   ["people","people-outline"],
  Mechanics:   ["construct","construct-outline"],
  Waitlisted:  ["time","time-outline"],
};

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.adminAccent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.adminAccentPastel, borderTopWidth: 1.5, height: 60, paddingBottom: 8, paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const [a, i] = ICONS[route.name] || ["ellipse","ellipse-outline"];
          return <Ionicons name={focused ? a : i} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard"  component={AdminDashboardScreen} />
      <Tab.Screen name="Customers"  component={AdminCustomersScreen} />
      <Tab.Screen name="Mechanics"  component={AdminMechanicsScreen} />
      <Tab.Screen name="Waitlisted" component={AdminWaitlistedScreen} />
    </Tab.Navigator>
  );
}