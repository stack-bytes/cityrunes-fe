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
        activeRoad.places.forEach((place) => {
          markers.push({
            id: place.id,
            title: place.name,
            coordinates: {
              latitude: place.coordinates.latitude,
              longitude: place.coordinates.longitude,
            },
            systemImage: place.icon,
          });
        });
      }
      return markers;
    }

    activeMarkers.forEach((markerId) => {
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
    });

    return markers;
  };

  const handleMarkerClick = (markerId: string) => {
    if (activeRoadId) {
      // When in tracking mode, show the popup for the clicked place
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
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backgroundStyle={{ backgroundColor: "#118CF7" }}
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
                  localImageSource={require("../../assets/images/historic-landmarks/statuie.png")}
                  tag="10G"
                  title={selectedPlace.name}
                  description={selectedPlace.description}
                  isQuiz={
                    activeRoad?.quests[activeRoad.places.indexOf(selectedPlace)]
                      .type === "QUIZ"
                      ? true
                      : false
                  }
                  onStartQuiz={() => {
                    console.log(
                      `Starting quiz for place: ${selectedPlace.name}`
                    );
                    closeSheet();
                    router.push("/QuizPage");
                  }}
                  onContinue={() => {
                    console.log("Continuing...");
                    closeSheet();
                  }}
                />
              ) : null;
            })()
          ) : expandedRoadId ? (
            <MapBottomSheet
              tag="10G"
              title={
                roads.find((road) => road.id === expandedRoadId)?.name || "Road"
              }
              description={
                roads.find((road) => road.id === expandedRoadId)?.description ||
                "Description"
              }
              localImageSource={require("../../assets/images/historic-landmarks/statuie.png")}
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
