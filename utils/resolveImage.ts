import { ImageSourcePropType } from "react-native";

export const IMAGE_MAP: { [key: string]: ImageSourcePropType } = {
  "biserica-reformata.png": require("../assets/images/historic-landmarks/biserica-reformata.png"),
  "sf-maria.png": require("../assets/images/historic-landmarks/sf-maria.png"),
  "catedrala-mitropolitana.png": require("../assets/images/historic-landmarks/catedrala-metropolitana.png"),
  "catedrala-metropolitana.png": require("../assets/images/historic-landmarks/catedrala-metropolitana.png"),
  "piata-victoriei.png": require("../assets/images/historic-landmarks/piata-victoriei.png"),
  "piata-libertatii.png": require("../assets/images/historic-landmarks/piata-libertatii.png"),
  "muzeul-comunist.png": require("../assets/images/historic-landmarks/muzeul-comunist.png"),
  "muzeul-arta.png": require("../assets/images/historic-landmarks/muzeul-arta.png"),
  "muzeul-satului.png": require("../assets/images/historic-landmarks/muzeul-satului.png"),
  "cimitirul-eroilor.png": require("../assets/images/historic-landmarks/cimitirul-eroilor.png"),
  "statuie.png": require("../assets/images/historic-landmarks/statuie.png"),
  "store/airplane.png": require("../assets/images/store/airplane.png"),
  "store/alarm.png": require("../assets/images/store/alarm.png"),
  "store/anchor.png": require("../assets/images/store/anchor.png"),
  "store/archery.png": require("../assets/images/store/archery.png"),
  "store/brain.png": require("../assets/images/store/brain.png"),
  "store/cowboy.png": require("../assets/images/store/cowboy.png"),
  "badges/Vector.png": require("../assets/images/badges/Vector.png"),
  "badges/Vector2.png": require("../assets/images/badges/Vector2.png"),
  "badges/pillar.png": require("../assets/images/badges/pillar.png"),
  "raresc4.png": require("../assets/images/raresc4.png"),
  "popa.jpg": require("../assets/images/popa.jpg"),
  "raul.jpeg": require("../assets/images/raul.jpeg"),
  "alexia.jpg": require("../assets/images/alexia.jpg"),
  "adi.png": require("../assets/images/adi.png"),
};

const FALLBACK_KEY = "statuie.png";

export interface ResolvableImage {
  imageId?: string | null;
  imageUrl?: string | null;
}

export function resolveImage(
  source: ResolvableImage,
  fallbackKey: string = FALLBACK_KEY
): ImageSourcePropType {
  if (source.imageUrl) {
    return { uri: source.imageUrl };
  }
  if (source.imageId && IMAGE_MAP[source.imageId]) {
    return IMAGE_MAP[source.imageId];
  }
  return IMAGE_MAP[fallbackKey];
}
