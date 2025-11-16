import { RootState } from "@/store";
import { addCoins } from "@/store/slices/userSlice";
import { router } from "expo-router";
import { Cog } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";

const BADGES = [
  {
    name: "Historian",
    image: require("../../assets/images/badges/Vector.png"),
    backgroundColor: "#D8ECFF",
  },
  {
    name: "Scholar",
    image: require("../../assets/images/badges/Vector2.png"),
    backgroundColor: "#CFE2FF",
  },
  {
    name: "Guardian",
    image: require("../../assets/images/badges/pillar.png"),
    backgroundColor: "#FFE8F1",
  },
];

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const name = user.username;
  const balance = user.coins;
  const purchasedBadges = user.purchasedBadges || [];

  // Combine default badges with purchased badges
  const allBadges = [...BADGES, ...purchasedBadges];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Cog
            style={styles.settingsIcon}
            onPress={() => {
              dispatch(addCoins(10));
            }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.username}>{name}</Text>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={require("../../assets/images/raresc4.png")}
            style={styles.profileImage}
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.xpBadge}
        onPress={() => router.push("/StorePage")}
      >
        <Text style={styles.xpText}>{balance}G</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        {allBadges.map((badge, index) => (
          <TouchableOpacity
            key={`${badge.name}-${index}`}
            style={[
              styles.statCard,
              { backgroundColor: badge.backgroundColor },
            ]}
          >
            <Image source={badge.image} style={styles.badgeImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // softer background
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: verticalScale(20),
    paddingTop: verticalScale(12),
  },
  settingsButton: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  settingsIcon: {
    width: verticalScale(26),
    height: verticalScale(26),
    color: "#FFFFFF",
  },
  username: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(34),
    color: "#007AFF",
    textAlign: "center",
    marginTop: verticalScale(-16),
    letterSpacing: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 4,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: verticalScale(22),
  },
  profileImageWrapper: {
    width: verticalScale(200),
    height: verticalScale(200),
    borderRadius: verticalScale(28),
    borderWidth: 3,
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  xpBadge: {
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: verticalScale(28),
    paddingVertical: verticalScale(10),
    borderRadius: verticalScale(22),
    marginTop: verticalScale(22),
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  xpText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(16),
    color: "#FFF",
    letterSpacing: 1,
  },
  statsScroll: {
    paddingHorizontal: verticalScale(20),
    paddingVertical: verticalScale(15),
    gap: verticalScale(22),
  },
  statCard: {
    width: verticalScale(100),
    height: verticalScale(100),
    borderRadius: verticalScale(22),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  badgeImage: {
    width: verticalScale(60),
    height: verticalScale(60),
    resizeMode: "contain",
  },
});
