import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

interface MapBottomSheetProps {
  imageUrl?: string;
  localImageSource?: any;
  logoImageSource?: any;
  tag?: string;
  title?: string;
  description?: string;
  onStartTrack?: () => void;
  onContinue?: () => void;
}

export default function MapBottomSheet({
  imageUrl,
  localImageSource,
  tag = "10G",
  title = "Grand Monument",
  description = "Welcome to grand monument, look around at the clues and when you are ready press the button to take the quiz",
  onStartTrack,
  onContinue,
}: MapBottomSheetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {localImageSource || imageUrl ? (
            <Image
              source={localImageSource ? localImageSource : { uri: imageUrl }}
              style={styles.image}
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image
              style={styles.roadLogo}
              source={require("../assets/images/buttons/routes.png")}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.startQuizButton}
            onPress={onStartTrack}
          >
            <Image
              style={styles.iconPlaceholder}
              source={require("../assets/images/buttons/help-box-multiple.png")}
            />
            <Text style={styles.buttonText}>Start Track</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Image
              style={styles.iconPlaceholder}
              source={require("../assets/images/buttons/exit-run.png")}
            />
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#118CF7",
    borderRadius: 10,
    width: "100%",
    height: 320,
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: 145,
    overflow: "hidden",
    top: 0,
    left: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  tagBadge: {
    position: "absolute",
    top: 7,
    left: 7,
    backgroundColor: "#52A9FF",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    height: 24,
    justifyContent: "center",
  },
  tagText: {
    fontFamily: "SilkscreenBold",
    fontSize: 12,
    color: "#007AFF",
    letterSpacing: 0.25,
    lineHeight: 17,
  },
  titleContainer: {
    position: "absolute",
    top: 149,
    left: verticalScale(52),
    width: 298,
    height: 53,
  },
  title: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(16),
    color: "#E5FBEB",
    lineHeight: 40,
  },
  descriptionContainer: {
    position: "absolute",
    top: 195,
    left: 52,
    width: 319,
    alignItems: "center",
  },
  description: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#E5FBEB",
    textAlign: "center",
    lineHeight: 18,
  },
  buttonsContainer: {
    position: "absolute",
    top: 259,
    left: 76,
    flexDirection: "row",
    gap: 17,
  },
  startQuizButton: {
    backgroundColor: "#005CBF",
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 8,
    height: 36,
    width: 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  continueButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E5FBEB",
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 8,
    height: 36,
    width: 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  buttonText: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#E5FBEB",
    textAlign: "center",
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  logoContainer: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 42,
    height: 42,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#08F",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  roadLogo: {
    width: 30,
    height: 30,
  },
});
