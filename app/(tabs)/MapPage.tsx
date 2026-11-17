import CustomMarker, { MarkerVariant } from "@/components/CustomMarker";
import Header from "@/components/Header";
import MapBottomSheet from "@/components/MapBottomSheet";
import MapPopup from "@/components/MapPopup";
import { AppDispatch, RootState } from "@/store";
import {
  leaveRoad,
  startReplay,
  startRoad,
  stopReplay,
} from "@/store/slices/progressSlice";
import { selectQuestByPlaceId } from "@/store/slices/questsSlice";
import { Coordinates, Place } from "@/types/place";
import { Road } from "@/types/road";
import { getPlaceStatus, getRoadReward, PlaceStatus } from "@/utils/progress";
import { resolveImage } from "@/utils/resolveImage";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

interface MapMarker {
  key: string;
  roadId: string | null;
  placeId: string | null;
  coordinate: Coordinates;
  iconKey?: string;
  variant: MarkerVariant;
}

const STATUS_VARIANTS: Record<PlaceStatus, MarkerVariant> = {
  completed: "completed",
  next: "default",
  locked: "locked",
};

const FOCUS_ZOOM = 15;
const FEED_SHEET_DELAY_MS = 500;
const SNAP_POINTS = ["45%"];
const EMPTY_PLACE_IDS: string[] = [];

function zoomToDelta(zoom: number): Pick<Region, "latitudeDelta" | "longitudeDelta"> {
  const latitudeDelta = 360 / Math.pow(2, zoom);
  return { latitudeDelta, longitudeDelta: latitudeDelta };
}

const INITIAL_REGION: Region = {
  latitude: 45.758,
  longitude: 21.24,
  ...zoomToDelta(12),
};

export default function MapPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ roadId?: string; openSheet?: string }>();
  const roads = useSelector((state: RootState) => state.roads);
  const quests = useSelector((state: RootState) => state.quests);
  const progress = useSelector((state: RootState) => state.progress);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [expandedRoadId, setExpandedRoadId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const { activeRoadId, replay, saving } = progress;
  const currentRoadId = replay?.roadId ?? activeRoadId;
  const currentRoad = roads.find((road) => road.id === currentRoadId);
  const getCompletedPlaceIds = (roadId: string): string[] =>
    progress.roads[roadId]?.placeIds ?? EMPTY_PLACE_IDS;
  const currentPlaceIds = replay
    ? replay.placeIds
    : currentRoad
      ? getCompletedPlaceIds(currentRoad.id)
      : EMPTY_PLACE_IDS;

  const expandedRoad = roads.find((road) => road.id === expandedRoadId);
  const expandedProgress = expandedRoad
    ? progress.roads[expandedRoad.id]
    : undefined;
  const isExpandedCompleted = expandedProgress?.completed ?? false;

  const selectedPlace = currentRoad?.places.find(
    (place) =>
      place.id === selectedPlaceId &&
      getPlaceStatus(currentRoad, currentPlaceIds, place.id) === "next"
  );
  const selectedQuest = selectedPlace
    ? selectQuestByPlaceId(quests, selectedPlace.id)
    : undefined;

  const feedRoadId = params.openSheet === "true" ? params.roadId : undefined;

  const openSheet = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const closeSheet = () => {
    sheetRef.current?.close();
  };

  const focusOn = useCallback((coordinate: Coordinates) => {
    mapRef.current?.animateToRegion(
      { ...coordinate, ...zoomToDelta(FOCUS_ZOOM) },
      500
    );
  }, []);

  const showRoad = useCallback(
    (road: Road, focusPlace: Place | undefined = road.places[0]) => {
      setSelectedPlaceId(null);
      setExpandedRoadId(road.id);
      if (focusPlace) {
        focusOn(focusPlace.coordinates);
      }
      openSheet();
    },
    [focusOn, openSheet]
  );

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      setLocation(await Location.getCurrentPositionAsync({}));
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!feedRoadId) return;
    const timeoutId = setTimeout(() => {
      router.setParams({
        roadId: undefined,
        placeId: undefined,
        openSheet: undefined,
      });
      const road = roads.find((candidate) => candidate.id === feedRoadId);
      if (road) {
        showRoad(road);
      }
    }, FEED_SHEET_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [feedRoadId, roads, router, showRoad]);

  const buildMarkers = (): MapMarker[] => {
    const markers: MapMarker[] = [];

    if (location) {
      markers.push({
        key: "user-location",
        roadId: null,
        placeId: null,
        iconKey: "person",
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        variant: "user",
      });
    }

    const addPlace = (road: Road, place: Place, variant: MarkerVariant) => {
      markers.push({
        key: `${road.id}-${place.id}-${variant}`,
        roadId: road.id,
        placeId: place.id,
        coordinate: place.coordinates,
        iconKey: place.icon,
        variant,
      });
    };

    if (currentRoad) {
      currentRoad.places.forEach((place) =>
        addPlace(
          currentRoad,
          place,
          STATUS_VARIANTS[getPlaceStatus(currentRoad, currentPlaceIds, place.id)]
        )
      );
      return markers;
    }

    roads.forEach((road) => {
      if (road.id === expandedRoadId) {
        const placeIds = getCompletedPlaceIds(road.id);
        road.places.forEach((place) =>
          addPlace(
            road,
            place,
            STATUS_VARIANTS[getPlaceStatus(road, placeIds, place.id)]
          )
        );
      } else if (road.places[0]) {
        addPlace(
          road,
          road.places[0],
          progress.roads[road.id]?.completed ? "completed" : "default"
        );
      }
    });

    return markers;
  };

  const handleMarkerPress = (marker: MapMarker) => {
    if (!marker.roadId || !marker.placeId) return;

    if (currentRoad) {
      if (marker.variant === "default") {
        setSelectedPlaceId(marker.placeId);
        openSheet();
      }
      return;
    }

    const road = roads.find((candidate) => candidate.id === marker.roadId);
    if (road) {
      showRoad(
        road,
        road.places.find((place) => place.id === marker.placeId)
      );
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    if (currentRoad || event.nativeEvent.action === "marker-press") return;
    setExpandedRoadId(null);
  };

  const handleStartTrack = async () => {
    if (!expandedRoad) return;
    try {
      if (isExpandedCompleted) {
        await dispatch(startReplay(expandedRoad.id)).unwrap();
      } else {
        await dispatch(startRoad(expandedRoad.id)).unwrap();
      }
      closeSheet();
      setExpandedRoadId(null);
      setSelectedPlaceId(null);
    } catch (message) {
      Alert.alert("Could not start the track", String(message));
    }
  };

  const handleLeave = async () => {
    closeSheet();
    setSelectedPlaceId(null);
    if (replay) {
      dispatch(stopReplay());
      return;
    }
    try {
      await dispatch(leaveRoad()).unwrap();
    } catch (message) {
      Alert.alert("Could not leave the track", String(message));
    }
  };

  const openQuest = (place: Place, roadId: string) => {
    closeSheet();
    const quiz = selectedQuest?.type === "QUIZ" ? selectedQuest.quiz : null;
    if (quiz) {
      router.push({
        pathname: "/QuizPage",
        params: {
          question: quiz.question,
          answers: JSON.stringify(quiz.answers),
          correctAnswer: String(quiz.correctAnswer),
          placeId: place.id,
          placeName: place.name,
          roadId,
        },
      });
      return;
    }
    router.push({
      pathname: "/CameraPage",
      params: { placeId: place.id, name: place.name, roadId },
    });
  };

  const getStartLabel = () => {
    if (isExpandedCompleted) return "Replay Track";
    if (expandedProgress || expandedRoadId === activeRoadId) {
      return "Continue Track";
    }
    return "Start Track";
  };

  const questReward = replay ? 0 : (selectedQuest?.reward ?? 0);
  const roadReward =
    expandedRoad && !isExpandedCompleted ? getRoadReward(expandedRoad) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.maps}
        initialRegion={INITIAL_REGION}
        showsPointsOfInterests={false}
        onPress={handleMapPress}
      >
        {buildMarkers().map((marker) => (
          <Marker
            key={marker.key}
            identifier={marker.key}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <CustomMarker iconKey={marker.iconKey} variant={marker.variant} />
          </Marker>
        ))}
      </MapView>
      {currentRoad && (
        <Header
          title={replay ? `${currentRoad.name} (replay)` : currentRoad.name}
          onLeave={handleLeave}
          leaveDisabled={saving}
        />
      )}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backgroundStyle={{ backgroundColor: "#118CF7" }}
        handleIndicatorStyle={{ backgroundColor: "#FFF" }}
      >
        <BottomSheetView style={{ flex: 1, paddingBottom: 160 }}>
          {selectedPlace && currentRoad ? (
            <MapPopup
              localImageSource={resolveImage(selectedPlace)}
              tag={`${questReward}G`}
              title={selectedPlace.name}
              description={selectedPlace.description}
              isQuiz={selectedQuest?.type === "QUIZ" && !!selectedQuest.quiz}
              onTakePhoto={() => openQuest(selectedPlace, currentRoad.id)}
              onStartQuiz={() => openQuest(selectedPlace, currentRoad.id)}
              onContinue={closeSheet}
            />
          ) : expandedRoad ? (
            <MapBottomSheet
              tag={`${roadReward}G`}
              title={expandedRoad.name}
              description={expandedRoad.description}
              localImageSource={
                expandedRoad.places[0]
                  ? resolveImage(expandedRoad.places[0])
                  : null
              }
              startLabel={getStartLabel()}
              startDisabled={saving || expandedRoad.places.length === 0}
              onStartTrack={handleStartTrack}
              onContinue={closeSheet}
            />
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maps: {
    flex: 1,
  },
});
