import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const ICONS = [
  {
    id: "ap",
    source: require("../assets/images/navbar/access-point.png"),
    label: "Access",
  },
  {
    id: "map",
    source: require("../assets/images/navbar/routes.png"),
    label: "Map",
  },
  {
    id: "me",
    source: require("../assets/images/navbar/face-man-profile.png"),
    label: "Profile",
  },
];

export default function NavbarVector() {
  const [active, setActive] = useState("ap");
  const router = useRouter();

  const handleNavigation = (id: string) => {
    setActive(id);
    switch (id) {
      case "ap":
        router.push("/(tabs)/FeedPage");
        break;
      case "map":
        router.push("/(tabs)/MapPage");
        break;
      case "me":
        router.push("/(tabs)/ProfilePage");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.navbar}>
      {ICONS.map((it, index) => {
        const isActive = it.id === active;
        let iconStyle = styles.iconLeft;
        if (index === 1) iconStyle = styles.iconMiddle;
        if (index === 2) iconStyle = styles.iconRight;

        return (
          <TouchableOpacity
            key={it.id}
            onPress={() => handleNavigation(it.id)}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={it.label}
          >
            <Image
              source={it.source}
              style={[styles.icon, iconStyle, { opacity: isActive ? 1 : 0.45 }]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    display: "flex",
    width: 335,
    height: 79,
    paddingVertical: 14,
    paddingHorizontal: 153,
    justifyContent: "center",
    alignItems: "center",
    gap: 70,
    flexShrink: 0,
    borderRadius: 43.5,
    backgroundColor: "#118CF7",
    position: "absolute",
    left: 45,
    right: 20,
    bottom: 60,
    flexDirection: "row",
  },
  iconButton: {
    padding: 0,
  },
  icon: {
    tintColor: "#fff",
  },
  iconLeft: {
    width: 51,
    height: 51,
    flexShrink: 0,
    aspectRatio: 1,
  },
  iconMiddle: {
    width: 38.25,
    height: 42.5,
    flexShrink: 0,
    aspectRatio: 1,
  },
  iconRight: {
    width: 42.5,
    height: 42.5,
    flexShrink: 0,
    aspectRatio: 1,
  },
});
