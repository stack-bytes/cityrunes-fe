import BasicButton from "@/components/BasicButton";
import FeedCard from "@/components/FeedCard";
import MonumentCard from "@/components/MonumentCard";
import { RootState } from "@/store";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";

const IMAGE_MAP: { [key: string]: any } = {
  "biserica-reformata.png": require("../../assets/images/historic-landmarks/biserica-reformata.png"),
  "sf-maria.png": require("../../assets/images/historic-landmarks/sf-maria.png"),
  "catedrala-mitropolitana.png": require("../../assets/images/historic-landmarks/catedrala-metropolitana.png"),
  "catedrala-metropolitana.png": require("../../assets/images/historic-landmarks/catedrala-metropolitana.png"),
  "piata-victoriei.png": require("../../assets/images/historic-landmarks/piata-victoriei.png"),
  "piata-libertatii.png": require("../../assets/images/historic-landmarks/piata-libertatii.png"),
  "muzeul-comunist.png": require("../../assets/images/historic-landmarks/muzeul-comunist.png"),
  "muzeul-arta.png": require("../../assets/images/historic-landmarks/muzeul-arta.png"),
  "muzeul-satului.png": require("../../assets/images/historic-landmarks/muzeul-satului.png"),
  "cimitirul-eroilor.png": require("../../assets/images/historic-landmarks/cimitirul-eroilor.png"),
  "statuie.png": require("../../assets/images/historic-landmarks/statuie.png"),
};

export default function FeedPage() {
  const roadsFromStore = useSelector((state: RootState) => state.roads);
  const [searchText, setSearchText] = useState("");
  const [tracks, setTracks] = useState(roadsFromStore);

  const onSearchButtonPress = () => {
    setSearchText("");
    const newTracks = roadsFromStore.filter((track) =>
      track.name.toLowerCase().includes(searchText.toLowerCase())
    );
    newTracks.length && setTracks(newTracks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.titleContainer}>
              <Image
                source={require("../../assets/images/landing-page/chess-rook.png")}
                style={styles.textLogo}
              />
              <Text style={styles.text}>CITYRUNES</Text>
            </View>

            <View style={styles.cardContainer}>
              <MonumentCard
                title={roadsFromStore[0].name}
                tag="Hyped"
                localImageSource={
                  IMAGE_MAP[
                    roadsFromStore[0]?.places?.[0]?.photos?.[0] || "statuie.png"
                  ]
                }
              />
            </View>
            <View style={styles.verticalLine} />

            <View style={styles.search}>
              <BasicButton
                containerStyles={styles.searchButton}
                iconSource={require("@/assets/images/buttons/magnify.png")}
                iconStyles={styles.searchLogo}
                onPress={() => onSearchButtonPress()}
              />
              <BasicButton
                containerStyles={styles.filterButton}
                iconSource={require("@/assets/images/buttons/filter.png")}
                iconStyles={styles.filterLogo}
                onPress={() => {}}
              />
              <TextInput
                style={styles.searchBox}
                placeholder="Search Tracks"
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          </>
        }
        renderItem={({ item }) => {
          const photoPath = item.places?.[0]?.photos?.[0] || "statuie.png";
          const firstPlaceId = item.places?.[0]?.id;
          return (
            <View style={styles.feedCardContainer}>
              <FeedCard
                title={item.name}
                imageSource={IMAGE_MAP[photoPath]}
                roadId={item.id}
                firstPlaceId={firstPlaceId}
              />
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: verticalScale(8),
  },
  textLogo: {
    width: verticalScale(24),
    height: verticalScale(34),
    marginLeft: verticalScale(42),
    marginTop: verticalScale(10),
  },
  text: {
    marginTop: verticalScale(20),
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(26),
    width: verticalScale(280),
    height: verticalScale(48),
    color: "#007AFF",
    flexShrink: 0,
  },
  cardContainer: {
    marginTop: verticalScale(10),
    alignItems: "center",
    paddingHorizontal: 16,
  },
  verticalLine: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    width: verticalScale(120),
    marginTop: verticalScale(30),
    marginLeft: verticalScale(98),
    marginBottom: verticalScale(15),
    flexShrink: 0,
  },
  search: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: verticalScale(22),
  },
  searchButton: {
    borderRadius: verticalScale(10),
    backgroundColor: "#118CF7",
    display: "flex",
    width: verticalScale(38),
    height: verticalScale(38),
    padding: verticalScale(8),
    marginLeft: verticalScale(8),
    marginRight: verticalScale(12),
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  searchLogo: {
    width: verticalScale(20),
    height: verticalScale(20),
    flexShrink: 0,
  },
  filterButton: {
    display: "flex",
    width: verticalScale(38),
    height: verticalScale(38),
    padding: verticalScale(8),
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexShrink: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#08F",
  },
  filterLogo: {
    width: verticalScale(20),
    height: verticalScale(20),
    flexShrink: 0,
  },
  searchBox: {
    width: verticalScale(194),
    height: verticalScale(38),
    paddingHorizontal: verticalScale(8),
    marginRight: verticalScale(10),
    borderRadius: verticalScale(9),
    borderWidth: 1,
    borderColor: "#C7C7C7",
    backgroundColor: "#E5E5E5",
    fontFamily: "Inter",
    fontSize: verticalScale(13),
    color: "#000",
  },
  feedCardContainer: {
    marginTop: verticalScale(15),
    alignItems: "center",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: verticalScale(100),
  },
});
