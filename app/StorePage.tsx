import { RootState } from "@/store";
import { purchaseBadge } from "@/store/slices/userSlice";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
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
import { useDispatch, useSelector } from "react-redux";

const STORE_ITEMS = [
  {
    name: "Airplane",
    image: require("../assets/images/store/airplane.png"),
    backgroundColor: "#FFE8F1",
    price: 50,
  },
  {
    name: "Alarm",
    image: require("../assets/images/store/alarm.png"),
    backgroundColor: "#D8ECFF",
    price: 30,
  },
  {
    name: "Anchor",
    image: require("../assets/images/store/anchor.png"),
    backgroundColor: "#CFE2FF",
    price: 40,
  },
  {
    name: "Archery",
    image: require("../assets/images/store/archery.png"),
    backgroundColor: "#FFE8F1",
    price: 60,
  },
  {
    name: "Brain",
    image: require("../assets/images/store/brain.png"),
    backgroundColor: "#D8ECFF",
    price: 70,
  },
  {
    name: "Cowboy",
    image: require("../assets/images/store/cowboy.png"),
    backgroundColor: "#CFE2FF",
    price: 80,
  },
];

export default function StorePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const purchasedBadges = user.purchasedBadges || [];

  // Filter out purchased items
  const availableItems = STORE_ITEMS.filter(
    (item) => !purchasedBadges.some((b) => b.name === item.name)
  );

  const handlePurchase = (item: (typeof STORE_ITEMS)[0]) => {
    if (user.coins < item.price) {
      Alert.alert(
        "Insufficient Funds",
        `You need ${item.price}G but only have ${user.coins}G`
      );
      return;
    }

    Alert.alert("Purchase Badge", `Buy ${item.name} for ${item.price}G?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Buy",
        onPress: () => {
          dispatch(
            purchaseBadge({
              badge: {
                name: item.name,
                image: item.image,
                backgroundColor: item.backgroundColor,
              },
              price: item.price,
            })
          );
          Alert.alert("Success!", `You purchased ${item.name}!`);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>{user.coins}G</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {availableItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🎉 All items purchased!</Text>
            <Text style={styles.emptySubtext}>
              Check your profile to see your collection
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {availableItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.itemCard,
                  { backgroundColor: item.backgroundColor },
                ]}
                onPress={() => handlePurchase(item)}
              >
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{item.price}G</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: verticalScale(20),
    paddingVertical: verticalScale(16),
  },
  backButton: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    backgroundColor: "#E5F1FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(24),
    color: "#007AFF",
    letterSpacing: 1,
  },
  balanceContainer: {
    backgroundColor: "#007AFF",
    paddingHorizontal: verticalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: verticalScale(20),
  },
  balanceText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(14),
    color: "#FFF",
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: verticalScale(16),
  },
  itemCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: verticalScale(16),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  purchasedCard: {
    opacity: 0.6,
  },
  ownedBadge: {
    position: "absolute",
    top: verticalScale(8),
    right: verticalScale(8),
    backgroundColor: "#4CAF50",
    paddingHorizontal: verticalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: verticalScale(8),
    zIndex: 1,
  },
  ownedText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(10),
    color: "#FFF",
    letterSpacing: 0.5,
  },
  itemImage: {
    width: verticalScale(70),
    height: verticalScale(70),
    resizeMode: "contain",
  },
  priceContainer: {
    marginTop: verticalScale(12),
    backgroundColor: "#007AFF",
    paddingHorizontal: verticalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(12),
  },
  priceText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(14),
    color: "#FFF",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(20),
    color: "#007AFF",
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  emptySubtext: {
    fontFamily: "Inter",
    fontSize: verticalScale(14),
    color: "#666",
    textAlign: "center",
  },
});
