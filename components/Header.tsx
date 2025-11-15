import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dialog}>
        <Text style={styles.heading}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: verticalScale(17),
    left: 15,
    right: 15,
    zIndex: 100,
  },
  dialog: {
    backgroundColor: "#118CF7",
    minHeight: verticalScale(73),
    borderRadius: 96,
    paddingHorizontal: 34,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(20),
    color: "#E5FBEB",
    letterSpacing: 0.25,
    textAlign: "center",
    textTransform: "uppercase",
    flexWrap: "wrap",
  },
});
