import { compareImage } from "@/actions/camera";
import { addCoins, completePlace } from "@/store/slices/userSlice";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function CameraPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const params = useLocalSearchParams();

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

  const processPhoto = async (photo: { uri: string }) => {
    try {
      setIsProcessing(true);

      const result = await compareImage(
        photo,
        (params.name as string) || "Location",
        (params.description as string) || "Description"
      );

      if (result.similarity >= result.thresholdHint) {
        const placeId = params.id as string;
        const reward = params.reward ? Number(params.reward) : 0;
        if (placeId) {
          dispatch(completePlace(placeId));
          dispatch(addCoins(reward));
        }
        Alert.alert("Success!", `Match found! +${reward}G`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("No Match", `No match found for your picture.`, [
          { text: "Try Again", style: "cancel" },
          { text: "Cancel", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Error processing photo:", error);
      Alert.alert("Error", "Failed to verify location. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo taken:", photo);
        await processPhoto(photo);
      } catch (error) {
        console.error("Error taking photo:", error);
        setIsProcessing(false);
      }
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
        mediaTypes: "images" as any,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = { uri: result.assets[0].uri };
        console.log("Image picked:", photo);
        await processPhoto(photo);
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
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
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
          <TouchableOpacity
            style={[
              styles.captureButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          {isProcessing && (
            <Text style={styles.processingText}>Verifying location...</Text>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
