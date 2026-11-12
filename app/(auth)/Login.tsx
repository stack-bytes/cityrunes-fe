import AuthInput from "@/components/AuthInput";
import BasicButton from "@/components/BasicButton";
import Background from "@/components/Gradient";
import { AppDispatch } from "@/store";
import { loginUser } from "@/store/slices/userSlice";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { useDispatch } from "react-redux";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);
    const result = await dispatch(loginUser({ email, password }));
    setIsSubmitting(false);

    if (loginUser.fulfilled.match(result)) {
      router.replace("/(tabs)/FeedPage");
      return;
    }
    setErrorMessage(result.payload ?? "Could not log in.");
  };

  const PasswordIcon = isPasswordVisible ? EyeOff : Eye;

  return (
    <SafeAreaView style={styles.container}>
      <Background>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("../../assets/images/landing-page/chess-rook.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>CITYRUNES</Text>
            <View style={styles.verticalLine} />
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              rightIcon={<PasswordIcon size={20} color="#007AFF" />}
              onRightIconPress={() => setIsPasswordVisible((visible) => !visible)}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <BasicButton
              text={isSubmitting ? "Logging in..." : "Log in"}
              containerStyles={styles.loginButton}
              textStyles={styles.loginText}
              onPress={handleLogin}
              disabled={isSubmitting}
            />
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>{"Don't have an account? "}</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Background>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  backButton: {
    position: "absolute",
    top: verticalScale(16),
    left: verticalScale(16),
    zIndex: 10,
    padding: verticalScale(4),
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  logo: {
    width: verticalScale(120),
    height: verticalScale(120),
  },
  title: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(32),
    color: "#007AFF",
    marginTop: verticalScale(8),
  },
  verticalLine: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    width: verticalScale(200),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  errorText: {
    width: verticalScale(260),
    minHeight: verticalScale(18),
    marginTop: verticalScale(10),
    fontFamily: "Inter",
    fontSize: verticalScale(13),
    color: "#D32F2F",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    marginTop: verticalScale(14),
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
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(24),
  },
  registerPrompt: {
    fontFamily: "Inter",
    fontSize: verticalScale(14),
    color: "#666",
  },
  registerLink: {
    fontFamily: "Inter",
    fontSize: verticalScale(14),
    fontWeight: "600",
    color: "#007AFF",
  },
});
