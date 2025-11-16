import Header from "@/components/Header";
import MapBottomSheet from "@/components/MapBottomSheet";
import MapPopup from "@/components/MapPopup";
import { RootState } from "@/store";
import { Road } from "@/types/road";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { AppleMaps, Coordinates } from "expo-maps";
import { AppleMapsMarker } from "expo-maps/build/apple/AppleMaps.types";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function MapPage() {
  const router = useRouter();
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

  const sheetRef = useRef<BottomSheet>(null);

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

  const camera = useMemo(
    () => ({
      coordinates,
      zoom: zoomLevel,
      pitch: 0,
      heading: 0,
    }),
    [coordinates, zoomLevel]
  );

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

  const assembleMarkers = (): AppleMapsMarker[] => {
    const markers: AppleMapsMarker[] = [];
    const completedPlaces = user.completedPlaces || [];

    if (location) {
      markers.push({
        id: "user-location",
        systemImage: "person",
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        tintColor: "blue",
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
              title: place.name,
              coordinates: {
                latitude: place.coordinates.latitude,
                longitude: place.coordinates.longitude,
              },
              systemImage: place.icon,
              tintColor: "green",
            });
          });
        } else {
          activeRoad.places.forEach((place) => {
            if (!completedPlaces.includes(place.id)) {
              markers.push({
                id: place.id,
                title: place.name,
                coordinates: {
                  latitude: place.coordinates.latitude,
                  longitude: place.coordinates.longitude,
                },
                systemImage: place.icon,
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
              title: place.name,
              coordinates: {
                latitude: place.coordinates.latitude,
                longitude: place.coordinates.longitude,
              },
              systemImage: place.icon,
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
      openSheet();
    }

    const clickedPlace = targetRoad.places.find((p) => p.id === markerId);
    if (clickedPlace) {
      setCoordinates(clickedPlace.coordinates);
      setZoomLevel(15);
    }

    if (expandedRoadId === targetRoad.id) {
      const newActiveMarkers = new Set<string>(activeMarkers);
      targetRoad.places.forEach((place) => {
        newActiveMarkers.add(place.id);
      });
      setActiveMarkers(newActiveMarkers);
      setExpandedRoadId(null);
      setZoomLevel(14);
    } else {
      const newActiveMarkers = new Set<string>(activeMarkers);
      targetRoad.places.forEach((place) => {
        newActiveMarkers.add(place.id);
      });
      setActiveMarkers(newActiveMarkers);
      setExpandedRoadId(targetRoad.id);
    }
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
    console.log("Started tracking road:", targetRoad.name);
  };

  const handleMapClick = () => {
    if (activeRoadId) return;
    setActiveMarkers(getInitialMarkers());
  };

  const getImageTrack = () => {
    if (expandedRoadId) {
      const expandedRoad = roads.find((road) => road.id === expandedRoadId);
      if (expandedRoad && expandedRoad.places.length > 0) {
        const firstPlacePhoto =
          expandedRoad.places[0].photos?.[0] || "statuie.png";
        return IMAGE_MAP[firstPlacePhoto];
      }
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppleMaps.View
        style={styles.maps}
        cameraPosition={camera}
        properties={{
          pointsOfInterest: {
            including: [],
          },
        }}
        markers={assembleMarkers()}
        onMapClick={handleMapClick}
        onMarkerClick={(event) => handleMarkerClick(event.id!)}
      ></AppleMaps.View>
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
              return selectedPlace ? (
                <MapPopup
                  localImageSource={
                    selectedPlace.photos?.[0]
                      ? IMAGE_MAP[selectedPlace.photos[0]]
                      : null
                  }
                  tag={selectedPlace.reward + "G"}
                  title={selectedPlace.name}
                  description={selectedPlace.description}
                  isQuiz={
                    activeRoad?.quests[activeRoad.places.indexOf(selectedPlace)]
                      .type === "QUIZ"
                      ? true
                      : false
                  }
                  onTakePhoto={() => {
                    router.push({
                      pathname: "/CameraPage",
                      params: {
                        id: selectedPlace.id,
                        name: selectedPlace.name,
                        description: selectedPlace.description,
                        reward: String(selectedPlace.reward),
                      },
                    });
                  }}
                  onStartQuiz={() => {
                    closeSheet();
                    if (activeRoad) {
                      const placeIndex =
                        activeRoad.places.indexOf(selectedPlace);
                      const quest = activeRoad.quests[placeIndex];
                      const quiz = quest?.quiz?.[0];
                      router.push({
                        pathname: "/QuizPage",
                        params: {
                          question: quiz?.question || "Sample question?",
                          answers: JSON.stringify(quiz?.answers || []),
                          correctAnswer: String(quiz?.correct_answer || 0),
                          placeId: selectedPlace.id,
                          placeName: selectedPlace.name,
                          reward: String(selectedPlace.reward),
                        },
                      });
                    }
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
