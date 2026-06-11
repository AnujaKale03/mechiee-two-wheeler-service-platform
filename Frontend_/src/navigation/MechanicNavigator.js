import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MechanicProfileScreen  from "../screens/mechanic/MechanicProfileScreen";
import MechanicBookingsScreen from "../screens/mechanic/BookingsScreen";
import { COLORS } from "../utils/theme";

const Tab = createBottomTabNavigator();
const ICONS = { Profile: ["person","person-outline"], "My Jobs": ["construct","construct-outline"] };

export default function MechanicNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.mechanicAccent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.mechanicAccentPastel, borderTopWidth: 1.5, height: 60, paddingBottom: 8, paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const [a, i] = ICONS[route.name] || ["ellipse","ellipse-outline"];
          return <Ionicons name={focused ? a : i} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile"  component={MechanicProfileScreen} />
      <Tab.Screen name="My Jobs"  component={MechanicBookingsScreen} />
    </Tab.Navigator>
  );
}