import Navbar from "@/components/Navbar";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
        tabBar={() => <Navbar />}
      >
        <Tabs.Screen
          name="FeedPage"
          options={{
            href: "/(tabs)/FeedPage",
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: verticalScale(70),
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
});
