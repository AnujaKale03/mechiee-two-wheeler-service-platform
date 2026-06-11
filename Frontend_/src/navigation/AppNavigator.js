import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";

import CustomerLoginScreen from "../screens/customer/CustomerLoginScreen";
import MechanicLoginScreen from "../screens/mechanic/MechanicLoginScreen";
import AdminLoginScreen from "../screens/admin/AdminLoginScreen";

import PhoneEntryScreen from "../screens/auth/PhoneEntryScreen";
import OtpVerifyScreen from "../screens/auth/OtpVerifyScreen";
import AuthSuccessScreen from "../screens/auth/AuthSuccessScreen";

import CustomerNavigator from "./CustomerNavigator";
import MechanicNavigator from "./MechanicNavigator";
import AdminNavigator from "./AdminNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
        />

        <Stack.Screen
          name="CustomerLoginScreen"
          component={CustomerLoginScreen}
        />

        <Stack.Screen
          name="MechanicLoginScreen"
          component={MechanicLoginScreen}
        />

        <Stack.Screen
          name="AdminLoginScreen"
          component={AdminLoginScreen}
        />

        <Stack.Screen
          name="PhoneEntry"
          component={PhoneEntryScreen}
        />

        <Stack.Screen
          name="OtpVerify"
          component={OtpVerifyScreen}
        />

        <Stack.Screen
          name="AuthSuccess"
          component={AuthSuccessScreen}
        />

        <Stack.Screen
          name="Customer"
          component={CustomerNavigator}
        />

        <Stack.Screen
          name="MechanicApp"
          component={MechanicNavigator}
        />

        <Stack.Screen
          name="AdminApp"
          component={AdminNavigator}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}