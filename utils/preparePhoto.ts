import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

const MAX_SIDE_PX = 1280;
const JPEG_QUALITY = 0.8;

export const preparePhoto = async (uri: string): Promise<string> => {
  const original = await ImageManipulator.manipulate(uri).renderAsync();
  const longestSide = Math.max(original.width, original.height);
  const image =
    longestSide > MAX_SIDE_PX
      ? await ImageManipulator.manipulate(original)
          .resize(
            original.width >= original.height
              ? { width: MAX_SIDE_PX, height: null }
              : { width: null, height: MAX_SIDE_PX }
          )
          .renderAsync()
      : original;
  const saved = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: JPEG_QUALITY,
  });
  return saved.uri;
};
