import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen           from "../screens/customer/HomeScreen";
import BookServiceScreen    from "../screens/customer/BookServiceScreen";
import BookingHistoryScreen from "../screens/customer/BookingHistoryScreen";
import { COLORS } from "../utils/theme";

const Tab = createBottomTabNavigator();
const ICONS = { Home: ["home","home-outline"], "Book Service": ["add-circle","add-circle-outline"], Bookings: ["receipt","receipt-outline"] };

export default function CustomerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 60, paddingBottom: 8, paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const [a, i] = ICONS[route.name] || ["ellipse","ellipse-outline"];
          return <Ionicons name={focused ? a : i} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"         component={HomeScreen} />
      <Tab.Screen name="Book Service" component={BookServiceScreen} />
      <Tab.Screen name="Bookings"     component={BookingHistoryScreen} />
    </Tab.Navigator>
  );
}