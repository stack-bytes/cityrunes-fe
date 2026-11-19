import { verifyPlacePhoto } from "@/actions/photoVerification";
import { toErrorMessage } from "@/lib/rpc";
import { AppDispatch } from "@/store";
import { submitPlaceCompletion } from "@/store/slices/progressSlice";
import { preparePhoto } from "@/utils/preparePhoto";
import { formatCompletionMessage } from "@/utils/progress";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Images } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type Stage = "checking" | "saving";

const STAGE_LABELS: Record<Stage, string> = {
  checking: "Checking photo...",
  saving: "Saving...",
};

export default function CameraPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [stage, setStage] = useState<Stage | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const params = useLocalSearchParams();
  const isProcessing = stage !== null;
  const roadId = (params.roadId as string) || "";
  const placeId = (params.placeId as string) || "";
  const placeName = (params.name as string) || "this place";

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const verifyPhoto = async (uri: string): Promise<boolean> => {
    try {
      const { match } = await verifyPlacePhoto(
        placeId,
        await preparePhoto(uri)
      );
      if (!match) {
        Alert.alert(
          "Not recognized",
          `We could not recognize ${placeName} in this photo. Try another angle or get closer.`,
          [{ text: "OK" }]
        );
      }
      return match;
    } catch (error) {
      Alert.alert("Could not verify your photo", toErrorMessage(error), [
        { text: "OK" },
      ]);
      return false;
    }
  };

  const completePlace = async () => {
    try {
      const outcome = await dispatch(
        submitPlaceCompletion({ roadId, placeId })
      ).unwrap();
      Alert.alert(
        "Success!",
        `Photo accepted! ${formatCompletionMessage(outcome)}`,
        [{ text: "OK", onPress: () => router.back() }],
        { cancelable: false }
      );
    } catch (message) {
      Alert.alert("Could not save your progress", String(message), [
        { text: "OK" },
      ]);
    }
  };

  const processPhoto = async (uri: string) => {
    setStage("checking");
    try {
      if (await verifyPhoto(uri)) {
        setStage("saving");
        await completePlace();
      }
    } finally {
      setStage(null);
    }
  };

  const capturePhoto = async (): Promise<string | null> => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      return photo?.uri ?? null;
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.", [
        { text: "OK" },
      ]);
      return null;
    }
  };

  const takePicture = async () => {
    if (isProcessing) return;
    setStage("checking");
    const uri = await capturePhoto();
    if (uri) {
      await processPhoto(uri);
    } else {
      setStage(null);
    }
  };

  const pickImageFromGallery = async () => {
    if (isProcessing) return;

    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photo library.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      const uri = result.canceled ? undefined : result.assets?.[0]?.uri;
      if (uri) {
        await processPhoto(uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      />
      <View style={styles.gradientOverlay} />

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../assets/images/buttons/routes.png")}
            style={styles.routeIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>
          {params.name ? params.name : "Location"}
        </Text>
      </View>

      <View style={styles.captureContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.galleryButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={pickImageFromGallery}
            activeOpacity={0.8}
            disabled={isProcessing}
            accessibilityLabel="Upload a photo from your gallery"
          >
            <Images color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.captureButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            activeOpacity={0.8}
            disabled={isProcessing}
            accessibilityLabel="Take a photo"
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          <View style={styles.controlSpacer} />
        </View>
        {stage && (
          <Text style={styles.processingText}>{STAGE_LABELS[stage]}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    pointerEvents: "none",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 34,
    height: 34,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  routeIcon: {
    width: 34,
    height: 34,
  },
  title: {
    fontFamily: "SilkscreenBold",
    fontSize: 28,
    color: "#118CF7",
    letterSpacing: 2,
    flex: 1,
  },
  captureContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButton: {
    width: 83,
    height: 83,
    borderRadius: 41.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 6,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "transparent",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  galleryButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  controlSpacer: {
    width: 56,
    height: 56,
  },
  processingText: {
    fontFamily: "SilkscreenBold",
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 15,
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionText: {
    fontFamily: "SilkscreenBold",
    fontSize: 18,
    color: "#118CF7",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 26,
  },
  permissionButton: {
    backgroundColor: "#118CF7",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  permissionButtonText: {
    fontFamily: "SilkscreenBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
