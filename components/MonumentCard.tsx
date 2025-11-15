import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

interface MonumentCardProps {
  imageUrl?: string;
  localImageSource?: any;
  tag?: string;
  title?: string;
}

export default function MonumentCard({
  imageUrl,
  localImageSource,
  tag = "Hyped",
  title = "Monument Rush",
}: MonumentCardProps) {
  return (
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
      </View>

      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#118CF7",
    borderRadius: verticalScale(10),
    borderWidth: verticalScale(1),
    borderColor: "#005CBF",
    width: verticalScale(290),
    height: verticalScale(170),
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    top: verticalScale(13),
    left: verticalScale(10),
    width: verticalScale(270),
    height: verticalScale(110),
    borderRadius: verticalScale(10),
    overflow: "hidden",
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
  tagContainer: {
    position: "absolute",
    top: verticalScale(20),
    left: verticalScale(18),
    backgroundColor: "#52A9FF",
    borderRadius: verticalScale(7),
    borderWidth: verticalScale(1),
    borderColor: "#007AFF",
    paddingHorizontal: verticalScale(4),
    height: verticalScale(18),
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    fontFamily: "SilkscreenBold",
    fontSize: 11,
    color: "#007AFF",
    letterSpacing: 0.25,
    lineHeight: 14,
  },
  titleContainer: {
    position: "absolute",
    top: verticalScale(128),
    left: verticalScale(10),
    width: verticalScale(250),
  },
  title: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(18),
    color: "#E5FBEB",
    letterSpacing: 0.25,
    lineHeight: verticalScale(34),
  },
});
