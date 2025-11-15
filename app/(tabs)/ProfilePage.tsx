import { Cog } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";

export interface UserProfileI {
  name: string;
  balance: number;
  photo: string;
  awards: AwardsI[];
}

export interface AwardsI {
  name: string;
  desc: string;
  emoji: string;
}

export default function ProfilePage({
  name = "Andrei",
  balance = 20,
  photo = "https://gd-prod.azureedge.net/-/media/project/guidedogs/guidedogsdotorg/images/how-you-can-help/nap-german-shepherd-puppies-hp.jpg",
  awards = [
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
    { name: "Community Pillar", desc: "Good behaviour", emoji: "😀" },
  ],
}: UserProfileI) {
  const awardColors = [
    "#E8F1FF",
    "#D8ECFF",
    "#CFE2FF",
    "#FFE8F1",
    "#FFF4D8",
    "#E9FFE8",
    "#F2E8FF",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Cog style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.username}>{name}</Text>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <Image source={{ uri: photo }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.xpBadge}>
        <Text style={styles.xpText}>{balance}G</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        {awards.map((award, index) => (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(`${awards[index].name}`, `${awards[index].desc}`);
            }}
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor:
                  awardColors[
                    awardColors.length * (index % 2) +
                      (index % 2 == 1 ? -1 : 1) *
                        (index % (awardColors.length - 1))
                  ],
              },
            ]}
          >
            <Text style={styles.emojiText}>{award.emoji}</Text>
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
    marginTop: verticalScale(24),
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
    paddingVertical: verticalScale(30),
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
  emojiText: {
    fontSize: verticalScale(44),
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
