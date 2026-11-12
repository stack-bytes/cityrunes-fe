import { AppDispatch, RootState } from "@/store";
import { loadCatalog } from "@/store/slices/catalogSlice";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ConnectionBanner() {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const status = useSelector((state: RootState) => state.catalog.status);
  const [dismissed, setDismissed] = useState(false);

  const isRetrying = status === "loading";
  const isVisible = (status === "failed" || isRetrying) && !dismissed;

  if (!isVisible) {
    return null;
  }

  const handleRetry = () => {
    setDismissed(false);
    dispatch(loadCatalog());
  };

  return (
    <View style={[styles.banner, { top: insets.top + 8 }]}>
      <Text style={styles.message}>
        Cannot connect to the database. Showing offline data.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
          disabled={isRetrying}
          activeOpacity={0.8}
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color="#E5484D" />
          ) : (
            <Text style={styles.retryText}>RETRY</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => setDismissed(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dismissText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 1000,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#E5484D",
  },
  message: {
    flex: 1,
    fontFamily: "SilkscreenRegular",
    fontSize: 12,
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButton: {
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  retryText: {
    fontFamily: "SilkscreenBold",
    fontSize: 12,
    color: "#E5484D",
  },
  dismissButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  dismissText: {
    fontFamily: "SilkscreenBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
