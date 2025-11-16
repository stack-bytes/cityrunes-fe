import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { verticalScale } from "react-native-size-matters";
import BasicButton from "./BasicButton";

interface FeedCardProps {
  title?: string;
  imageSource?: any;
}

export default function FeedCard({
  title = "Track Title",
  imageSource,
}: FeedCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <BasicButton
          containerStyles={styles.actionButton}
          iconSource={require("../assets/images/buttons/map-pin.png")}
          iconStyles={styles.icon}
          onPress={() => {}}
        />
        <BasicButton
          containerStyles={styles.actionButton}
          iconSource={require("../assets/images/badges/leaderboard.png")}
          iconStyles={styles.icon}
          onPress={() => router.push("/LeaderboardPage")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    width: verticalScale(272),
    height: verticalScale(130),
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: "absolute",
    left: verticalScale(10),
    top: verticalScale(10),
    width: verticalScale(126),
    height: verticalScale(110),
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#C7C7C7",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#C7C7C7",
  },
  titleContainer: {
    position: "absolute",
    left: verticalScale(146),
    top: verticalScale(10),
    right: verticalScale(2),
    paddingRight: verticalScale(5),
    justifyContent: "flex-start",
  },
  title: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(14),
    color: "#007AFF",
    letterSpacing: 0.25,
    lineHeight: verticalScale(20),
    flexWrap: "wrap",
  },
  actionsContainer: {
    position: "absolute",
    right: verticalScale(10),
    bottom: verticalScale(10),
    flexDirection: "row",
    gap: verticalScale(4),
  },
  actionButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7C7C7",
  },
  icon: {
    width: verticalScale(20),
    height: verticalScale(20),
    marginLeft: verticalScale(9),
    marginTop: verticalScale(8),
    resizeMode: "contain",
    color: "#007AFF",
  },
});
