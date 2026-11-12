import { AppDispatch, RootState } from "@/store";
import { loadCatalog } from "@/store/slices/catalogSlice";
import { ReactNode, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface CatalogGateProps {
  children: ReactNode;
}

export default function CatalogGate({ children }: CatalogGateProps) {
  const dispatch = useDispatch<AppDispatch>();
  const initialLoadSettled = useSelector(
    (state: RootState) => state.catalog.initialLoadSettled
  );

  useEffect(() => {
    dispatch(loadCatalog());
  }, [dispatch]);

  if (!initialLoadSettled) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#118CF7" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
