import { RootState } from "@/store";
import { useTrackLeaderboard } from "@/hooks/useTrackLeaderboard";
import { resolveImage } from "@/utils/resolveImage";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";

export default function LeaderboardPage() {
  const params = useLocalSearchParams();
  const trackId = params.trackId as string;

  const currentUser = useSelector((state: RootState) => state.user);
  const { data, isPending, isError, error, refetch } = useTrackLeaderboard(trackId);

  const allUsers = data?.users ?? [];
  const topThree = allUsers.slice(0, 3);
  const restOfUsers = allUsers.slice(3);

  const isLoading = !!trackId && isPending;
  const hasUsers = allUsers.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>LeaderBoard</Text>

        {isLoading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#118CF7" />
          </View>
        )}

        {!isLoading && isError && (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>
              {error instanceof Error
                ? error.message
                : "Could not load the leaderboard"}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && !hasUsers && (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>No players yet</Text>
          </View>
        )}

        {!isLoading && !isError && hasUsers && (
          <>
            <View style={styles.podiumContainer}>
              {topThree[1] && (
                <View style={styles.podiumItem}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={resolveImage({
                        imageId: topThree[1].avatarId,
                        imageUrl: topThree[1].avatarUrl,
                      })}
                      style={styles.podiumAvatar}
                    />
                  </View>
                  <Text style={styles.podiumName}>{topThree[1].username}</Text>
                  <View style={[styles.podiumBar, styles.silverBar]}>
                    <Text style={styles.podiumScore}>{topThree[1].points}</Text>
                  </View>
                </View>
              )}

              {topThree[0] && (
                <View style={styles.podiumItem}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={resolveImage({
                        imageId: topThree[0].avatarId,
                        imageUrl: topThree[0].avatarUrl,
                      })}
                      style={styles.podiumAvatar}
                    />
                  </View>
                  <Text style={styles.podiumName}>{topThree[0].username}</Text>
                  <View style={[styles.podiumBar, styles.goldBar]}>
                    <Text style={styles.podiumScore}>{topThree[0].points}</Text>
                  </View>
                </View>
              )}

              {topThree[2] && (
                <View style={styles.podiumItem}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={resolveImage({
                        imageId: topThree[2].avatarId,
                        imageUrl: topThree[2].avatarUrl,
                      })}
                      style={styles.podiumAvatar}
                    />
                  </View>
                  <Text style={styles.podiumName}>{topThree[2].username}</Text>
                  <View style={[styles.podiumBar, styles.bronzeBar]}>
                    <Text style={styles.podiumScore}>{topThree[2].points}</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.listContainer}>
              {restOfUsers.map((user) => {
                const isCurrentUser = user.id === currentUser.id;
                return (
                  <View
                    key={user.id}
                    style={[
                      styles.listItem,
                      isCurrentUser && styles.currentUserItem,
                    ]}
                  >
                    <Image
                      source={resolveImage({
                        imageId: user.avatarId,
                        imageUrl: user.avatarUrl,
                      })}
                      style={styles.listAvatar}
                    />
                    <View style={styles.listTextContainer}>
                      <Text
                        style={[
                          styles.listUsername,
                          isCurrentUser && styles.currentUserText,
                        ]}
                      >
                        {user.username}
                      </Text>
                      <Text style={styles.listPoints}>
                        {user.points} points
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: verticalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  backButton: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    backgroundColor: "#E5F1FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(28),
    color: "#118CF7",
    letterSpacing: 1,
    textAlign: "center",
    paddingHorizontal: verticalScale(20),
    paddingBottom: verticalScale(12),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: verticalScale(30),
    paddingVertical: verticalScale(60),
    gap: verticalScale(20),
  },
  stateText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(16),
    color: "#118CF7",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    borderRadius: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: verticalScale(32),
  },
  retryButtonText: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(16),
    color: "#FFF",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: verticalScale(20),
    marginHorizontal: verticalScale(20),
    gap: verticalScale(15),
  },
  podiumItem: {
    alignItems: "center",
    width: verticalScale(89),
  },
  avatarContainer: {
    marginBottom: verticalScale(8),
  },
  podiumAvatar: {
    width: verticalScale(87),
    height: verticalScale(87),
    borderRadius: verticalScale(20),
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  podiumName: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(16),
    color: "#118CF7",
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  podiumBar: {
    width: verticalScale(89),
    borderRadius: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  goldBar: {
    height: verticalScale(209),
    backgroundColor: "#FBDF6D",
  },
  silverBar: {
    height: verticalScale(168),
    backgroundColor: "#CACACA",
  },
  bronzeBar: {
    height: verticalScale(93),
    backgroundColor: "#9B5D1F",
  },
  podiumScore: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(28),
    color: "rgba(255, 255, 255, 0.67)",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: verticalScale(30),
    marginHorizontal: verticalScale(40),
  },
  listContainer: {
    gap: verticalScale(12),
    paddingHorizontal: verticalScale(20),
  },
  listItem: {
    backgroundColor: "#52A9FF",
    borderRadius: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(12),
    height: verticalScale(69),
  },
  currentUserItem: {
    backgroundColor: "#007AFF",
  },
  listAvatar: {
    width: verticalScale(52),
    height: verticalScale(52),
    borderRadius: verticalScale(18),
    marginRight: verticalScale(12),
  },
  listTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listUsername: {
    fontFamily: "SilkscreenBold",
    fontSize: verticalScale(16),
    color: "#005CBF",
    marginBottom: verticalScale(2),
  },
  currentUserText: {
    color: "#FFF",
  },
  listPoints: {
    fontFamily: "Silkscreen",
    fontSize: verticalScale(14),
    color: "#FFF",
  },
});
