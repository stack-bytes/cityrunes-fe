import BasicButton from "@/components/BasicButton";
import Background from "@/components/Gradient";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Background>
        <Image
          source={require("../../assets/images/landing-page/chess-rook.png")}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.title}>CITYRUNES</Text>
        <View style={styles.verticalLine} />
        <TouchableOpacity style={styles.appleButton}>
          <Text style={styles.appleText}> Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require("../../assets/images/landing-page/google-logo.png")}
            style={styles.googleLogo}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
        <BasicButton
          text="Login"
          containerStyles={styles.loginButton}
          textStyles={styles.loginText}
          onPress={() => router.navigate("/(tabs)/FeedPage")}
        />
        <BasicButton
          text="Register"
          containerStyles={styles.registerButton}
          textStyles={styles.registerText}
          onPress={() => {}}
        />
      </Background>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  logo: {
    width: verticalScale(190),
    height: verticalScale(190),
    position: "relative",
    top: -50,
    paddingTop: verticalScale(70),
    paddingLeft: verticalScale(120),
    flexShrink: 0,
  },
  title: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(32),
    width: verticalScale(315),
    height: verticalScale(54),
    marginTop: verticalScale(-28),
    marginLeft: verticalScale(38),
    color: "#007AFF",
    flexShrink: 0,
  },
  verticalLine: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    width: verticalScale(200),
    marginTop: verticalScale(20),
    marginLeft: verticalScale(55),
    flexShrink: 0,
  },
  appleButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: verticalScale(260),
    height: verticalScale(50),
    backgroundColor: "#FFF",
    borderRadius: verticalScale(14),
    marginTop: verticalScale(40),
    marginLeft: verticalScale(26),
    flexShrink: 0,
  },
  appleText: {
    fontFamily: "SF Pro",
    fontSize: verticalScale(16),
  },
  googleButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: verticalScale(260),
    height: verticalScale(50),
    backgroundColor: "#FFF",
    borderRadius: verticalScale(14),
    marginTop: verticalScale(15),
    marginLeft: verticalScale(26),
    flexShrink: 0,
  },
  googleLogo: {
    display: "flex",
    marginRight: verticalScale(10),
  },
  googleText: {
    fontFamily: "SF Pro",
    fontSize: verticalScale(16),
  },
  loginButton: {
    backgroundColor: "#007AFF",
    marginTop: verticalScale(55),
    marginLeft: verticalScale(26),
    width: verticalScale(260),
    height: verticalScale(50),
    borderRadius: verticalScale(14),
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  loginText: {
    fontSize: verticalScale(16),
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#FFF",
  },
  registerButton: {
    backgroundColor: "#FFF",
    marginTop: verticalScale(10),
    marginLeft: verticalScale(26),
    width: verticalScale(260),
    height: verticalScale(50),
    borderRadius: verticalScale(14),
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  registerText: {
    fontSize: verticalScale(16),
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#007AFF",
  },
});
