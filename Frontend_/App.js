import "react-native-gesture-handler";
import { useEffect, useCallback, useState } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import ChatbotWidget from "./src/components/ChatbotWidget";
import { InAppNotificationBanner } from "./src/components/InAppNotificationBanner";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppNavigator />
        <Toast />
        <InAppNotificationBanner />
        <ChatbotWidget />
      </View>
    </SafeAreaProvider>
  );
}