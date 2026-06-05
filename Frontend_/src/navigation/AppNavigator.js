// src/navigation/AppNavigator.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import CustomerNavigator from "./CustomerNavigator";
import MechanicNavigator from "./MechanicNavigator";
import { COLORS } from "../utils/theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.textInverse,
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Customer"
          component={CustomerNavigator}
          options={{
            title: "Customer Portal",
            headerBackTitleVisible: false,

          }}
        />
        <Stack.Screen
          name="Mechanic"
          component={MechanicNavigator}
          options={{
            title: "Mechanic Portal",
            headerBackTitleVisible: false,
                headerStyle: {
                backgroundColor: COLORS.mechanicAccent,
              },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}