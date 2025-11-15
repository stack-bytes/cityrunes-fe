import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/index";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SilkscreenRegular: require("../assets/fonts/Silkscreen/Silkscreen-Regular.ttf"),
    SilkscreenBold: require("../assets/fonts/Silkscreen/Silkscreen-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}
