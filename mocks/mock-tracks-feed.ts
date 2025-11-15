export const MOCK_TRACKS_FEED = Array.from({ length: 10 }, (_, i) => ({
  id: `track-${i}`,
  title: `Revolution Road ${i + 1}`,
  imageSource: require("../assets/images/historic-landmarks/statuie.png"),
}));
