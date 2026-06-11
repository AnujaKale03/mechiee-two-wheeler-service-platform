import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EAF5E5"
      />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
            <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
            />
        </View>
        </View>

      {/* Hero Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/onboarding_welcome_logo.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>
          Professional Bike Service{"\n"}
          At Your Doorstep
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("RoleSelection")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>Terms & Conditions</Text>
          {" "}and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#acbfa2",
  },

    logoContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    },

    logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    },

    logo: {
    width: 54,
    height: 54,
    },

  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    height: "85%",
  },

    bottomContainer: {
    backgroundColor: "#2b2f2a",

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    },

 title: {
  fontSize: 36,
  fontWeight: "800",
  color: "#e8dede",
  lineHeight: 46,
  marginBottom: 30,
},

  button: {
    backgroundColor: "#111",
    height: 58,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  footer: {
    fontSize: 13,
    color: "#828780",
    lineHeight: 20,
  },

  link: {
    textDecorationLine: "underline",
    color: "#666",
  },
});