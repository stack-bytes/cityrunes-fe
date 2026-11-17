import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";

interface HeaderProps {
  title: string;
  onLeave?: () => void;
  leaveDisabled?: boolean;
}

export default function Header({ title, onLeave, leaveDisabled }: HeaderProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dialog}>
        <Text style={styles.heading}>{title}</Text>
        {onLeave && (
          <TouchableOpacity
            style={[styles.leaveButton, leaveDisabled && styles.leaveDisabled]}
            onPress={onLeave}
            disabled={leaveDisabled}
            activeOpacity={0.8}
          >
            <Text style={styles.leaveText}>Leave</Text>
          </TouchableOpacity>
        )}
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
    gap: 8,
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
  leaveButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  leaveDisabled: {
    opacity: 0.5,
  },
  leaveText: {
    fontFamily: "SilkscreenBold",
    fontSize: 12,
    color: "#118CF7",
  },
});
