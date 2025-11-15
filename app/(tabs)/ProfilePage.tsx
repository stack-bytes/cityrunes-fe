import { SafeAreaView } from "react-native-safe-area-context";
import MapBottomSheet from "../../components/MapBottomSheet";

export default function ProfilePage() {
  return (
    <SafeAreaView>
      <MapBottomSheet
        title="Monument Rush"
        tag="10G"
        localImageSource={require("../../assets/images/historic-landmarks/statuie.png")}
      />
    </SafeAreaView>
  );
}
