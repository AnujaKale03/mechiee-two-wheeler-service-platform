import "react-native-gesture-handler";

import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
}