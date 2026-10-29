import React from "react";
import { StyleSheet, View } from "react-native";
import { renderMarkerIcon } from "./markerIcons";

export type MarkerVariant = "user" | "completed" | "default";

interface CustomMarkerProps {
  iconKey?: string;
  variant?: MarkerVariant;
}

const VARIANT_COLORS: Record<MarkerVariant, string> = {
  user: "#118CF7", 
  completed: "#2BBE4E", 
  default: "#F7A011", 
};

export default function CustomMarker({
  iconKey,
  variant = "default",
}: CustomMarkerProps) {
  const backgroundColor = VARIANT_COLORS[variant];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pin, { backgroundColor }]}>
        {renderMarkerIcon(iconKey, {
          size: 20,
          color: "#FFFFFF",
          strokeWidth: 2.5,
        })}
      </View>
      <View style={[styles.tip, { borderTopColor: backgroundColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  tip: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
