import Header from "@/components/Header";
import MapBottomSheet from "@/components/MapBottomSheet";
import MapPopup from "@/components/MapPopup";
import { getQuestForPlace } from "@/mocks/mock-quests";
import { RootState } from "@/store";
import { Road } from "@/types/road";
import CustomMarker, { MarkerVariant } from "@/components/CustomMarker";
import { Coordinates } from "@/types/place";
import { resolveImage } from "@/utils/resolveImage";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

interface MapMarker {
  id: string;
  coordinate: Coordinates;
  iconKey?: string;
  variant: MarkerVariant;
}

function zoomToDelta(zoom: number): Pick<Region, "latitudeDelta" | "longitudeDelta"> {
  const latitudeDelta = 360 / Math.pow(2, zoom);
  return { latitudeDelta, longitudeDelta: latitudeDelta };
}

export default function MapPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const roadsFromStore = useSelector((state: RootState) => state.roads);
  const user = useSelector((state: RootState) => state.user);
  const [roads, setRoads] = useState<Road[]>([]);
  const [activeMarkers, setActiveMarkers] = useState<Set<string>>(new Set());
  const [expandedRoadId, setExpandedRoadId] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 45.758,
    longitude: 21.24,
  });
  const [zoomLevel, setZoomLevel] = useState(12);
  const [activeRoadId, setActiveRoadId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const isTrackCompleted = useMemo(() => {
    if (!activeRoadId) return false;
    const activeRoad = roads.find((road) => road.id === activeRoadId);
    if (!activeRoad) return false;
    const completedPlaces = user.completedPlaces || [];
    return activeRoad.places.every((place) =>
      completedPlaces.includes(place.id)
    );
  }, [activeRoadId, roads, user.completedPlaces]);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (roadsFromStore && roadsFromStore.length > 0) {
      setRoads(roadsFromStore);
      const initialMarkers = roadsFromStore
        .filter((road) => road.places.length > 0)
        .map((road) => road.places[0].id);
      setActiveMarkers(new Set(initialMarkers));
    }
  }, [roadsFromStore]);

  useEffect(() => {
    if (isTrackCompleted && activeRoadId) {
      setActiveRoadId(null);
      setActiveMarkers(getInitialMarkers());
    }
  }, [isTrackCompleted]);

  // Handle navigation from FeedCard
  useEffect(() => {
    if (
      params.roadId &&
      params.placeId &&
      params.openSheet === "true" &&
      roads.length > 0
    ) {
      const roadId = params.roadId as string;
      const placeId = params.placeId as string;

      const road = roads.find((r) => r.id === roadId);
      if (road && road.places.length > 0) {
        const firstPlace = road.places[0];

        // Set expanded road to show the MapBottomSheet (track start sheet)
        setExpandedRoadId(roadId);

        // Expand all markers for this road
        const newActiveMarkers = new Set<string>(activeMarkers);
        road.places.forEach((place) => {
          newActiveMarkers.add(place.id);
        });
        setActiveMarkers(newActiveMarkers);

        // Center map on the first place
        setCoordinates({
          latitude: firstPlace.coordinates.latitude,
          longitude: firstPlace.coordinates.longitude,
        });
        setZoomLevel(15);

        // Open the bottom sheet
        setTimeout(() => {
          openSheet();
        }, 500);
      }
    }
  }, [params.roadId, params.placeId, params.openSheet, roads]);

  const region = useMemo<Region>(
    () => ({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      ...zoomToDelta(zoomLevel),
    }),
    [coordinates, zoomLevel]
  );

  // Animate the map whenever the target region changes (e.g. FeedCard
  // navigation centers on a place, or a marker tap focuses it).
  useEffect(() => {
    mapRef.current?.animateToRegion(region, 500);
  }, [region]);

  const snapPoints = ["45%"];

  const openSheet = () => {
    sheetRef.current?.snapToIndex(0);
  };

  const closeSheet = () => {
    sheetRef.current?.close();
  };

  const getInitialMarkers = (): Set<string> => {
    const initialMarkers = roads
      .filter((road) => road.places.length > 0)
      .map((road) => road.places[0].id);
    return new Set(initialMarkers);
  };

  const assembleMarkers = (): MapMarker[] => {
    const markers: MapMarker[] = [];
    const completedPlaces = user.completedPlaces || [];

    if (location) {
      markers.push({
        id: "user-location",
        iconKey: "person",
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        variant: "user",
      });
    }

    if (activeRoadId) {
      const activeRoad = roads.find((road) => road.id === activeRoadId);
      if (activeRoad) {
        if (isTrackCompleted) {
          // Show all markers when track is completed
          activeRoad.places.forEach((place) => {
            markers.push({
              id: place.id,
              coordinate: {
                latitude: place.coordinates.latitude,
                longitude: place.coordinates.longitude,
              },
              iconKey: place.icon,
              variant: "completed",
            });
          });
        } else {
          activeRoad.places.forEach((place) => {
            if (!completedPlaces.includes(place.id)) {
              markers.push({
                id: place.id,
                coordinate: {
                  latitude: place.coordinates.latitude,
                  longitude: place.coordinates.longitude,
                },
                iconKey: place.icon,
                variant: "default",
              });
            }
          });
        }
      }
      return markers;
    }

    activeMarkers.forEach((markerId) => {
      if (!completedPlaces.includes(markerId)) {
        roads.forEach((road) => {
          const place = road.places.find((p) => p.id === markerId);
          if (place) {
            markers.push({
              id: place.id,
              coordinate: {
                latitude: place.coordinates.latitude,
                longitude: place.coordinates.longitude,
              },
              iconKey: place.icon,
              variant: "default",
            });
          }
        });
      }
    });

    return markers;
  };

  const handleMarkerClick = (markerId: string) => {
    if (activeRoadId) {
      setSelectedPlaceId(markerId);
      openSheet();
      return;
    }

    const targetRoad = roads.find((road) =>
      road.places.some((place) => place.id === markerId)
    );

    if (!targetRoad) return;

    const isFirstPlace = targetRoad.places[0]?.id === markerId;

    if (isFirstPlace) {
      setExpandedRoadId(targetRoad.id);
      openSheet();
    }

    const clickedPlace = targetRoad.places.find((p) => p.id === markerId);
    if (clickedPlace) {
      setCoordinates(clickedPlace.coordinates);
      setZoomLevel(15);
    }

    const newActiveMarkers = new Set<string>(activeMarkers);
    targetRoad.places.forEach((place) => {
      newActiveMarkers.add(place.id);
    });
    setActiveMarkers(newActiveMarkers);
  };

  const onStartTrack = () => {
    closeSheet();
    const targetRoad = roads.find((road) => road.id === expandedRoadId);
    if (!targetRoad) return;

    const activeMarkersSet = new Set<string>(activeMarkers);
    targetRoad.places.forEach((place) => {
      activeMarkersSet.add(place.id);
    });
    setActiveMarkers(activeMarkersSet);
    setActiveRoadId(targetRoad.id);
  };

  const handleMapClick = () => {
    if (activeRoadId) return;
    setActiveMarkers(getInitialMarkers());
  };

  const getImageTrack = () => {
    if (expandedRoadId) {
      const expandedRoad = roads.find((road) => road.id === expandedRoadId);
      if (expandedRoad && expandedRoad.places.length > 0) {
        return resolveImage(expandedRoad.places[0]);
      }
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.maps}
        initialRegion={region}
        showsPointsOfInterests={false}
        onPress={handleMapClick}
      >
        {assembleMarkers().map((marker) => (
          <Marker
            key={marker.id}
            identifier={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerClick(marker.id)}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <CustomMarker iconKey={marker.iconKey} variant={marker.variant} />
          </Marker>
        ))}
      </MapView>
      {activeRoadId && !isTrackCompleted && (
        <Header
          title={
            roads.find((road) => road.id === activeRoadId)?.name || "TRACK"
          }
        />
      )}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backgroundStyle={{ backgroundColor: "#118CF7" }}
        handleIndicatorStyle={{ backgroundColor: "#FFF" }}
      >
        <BottomSheetView style={{ flex: 1, paddingBottom: 160 }}>
          {selectedPlaceId && activeRoadId ? (
            (() => {
              const activeRoad = roads.find((road) => road.id === activeRoadId);
              const selectedPlace = activeRoad?.places.find(
                (p) => p.id === selectedPlaceId
              );
              const selectedQuest = selectedPlace
                ? getQuestForPlace(selectedPlace.id)
                : undefined;
              return selectedPlace ? (
                <MapPopup
                  localImageSource={resolveImage(selectedPlace)}
                  tag={selectedPlace.reward + "G"}
                  title={selectedPlace.name}
                  description={selectedPlace.description}
                  isQuiz={selectedQuest?.type === "QUIZ"}
                  onTakePhoto={() => {
                    router.push({
                      pathname: "/CameraPage",
                      params: {
                        id: selectedPlace.id,
                        name: selectedPlace.name,
                        description: selectedPlace.description,
                        reward: String(selectedPlace.reward),
                        trackId: activeRoadId || "",
                      },
                    });
                  }}
                  onStartQuiz={() => {
                    closeSheet();
                    const quiz = selectedQuest?.quiz;
                    router.push({
                      pathname: "/QuizPage",
                      params: {
                        question: quiz?.question || "Sample question?",
                        answers: JSON.stringify(quiz?.answers || []),
                        correctAnswer: String(quiz?.correctAnswer || 0),
                        placeId: selectedPlace.id,
                        placeName: selectedPlace.name,
                        reward: String(selectedPlace.reward),
                        trackId: activeRoadId || "",
                      },
                    });
                  }}
                  onContinue={() => {
                    closeSheet();
                  }}
                />
              ) : null;
            })()
          ) : expandedRoadId ? (
            <MapBottomSheet
              tag={
                roads.find((road) => road.id === expandedRoadId)?.places
                  .length! *
                  10 +
                "G"
              }
              title={
                roads.find((road) => road.id === expandedRoadId)?.name || "Road"
              }
              description={
                roads.find((road) => road.id === expandedRoadId)?.description ||
                "Description"
              }
              localImageSource={getImageTrack()}
              onStartTrack={onStartTrack}
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
