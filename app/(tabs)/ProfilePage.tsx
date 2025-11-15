import { BottomSheet, Host } from "@expo/ui/swift-ui";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapBottomSheet from "../../components/MapBottomSheet";

export default function ProfilePage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <Host>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ marginBottom: 140, marginTop: 20 }}
          onPress={() => setIsBottomSheetOpen(true)} // 👈 open sheet
        >
          <Text>Push me</Text>
        </TouchableOpacity>

        <BottomSheet
          isOpened={isBottomSheetOpen}
          onIsOpenedChange={setIsBottomSheetOpen} // 👈 automatically syncs
        >
          <MapBottomSheet
            title="Monument Rush"
            tag="10G"
            localImageSource={require("../../assets/images/historic-landmarks/statuie.png")}
          />
        </BottomSheet>
      </SafeAreaView>
    </Host>
  );
}
