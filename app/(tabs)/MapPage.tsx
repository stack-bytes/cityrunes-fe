import MapBottomSheet from "@/components/MapBottomSheet";
import { RootState } from "@/store";
import { Road } from "@/types/road";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { AppleMaps, Coordinates } from "expo-maps";
import { AppleMapsMarker } from "expo-maps/build/apple/AppleMaps.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function MapPage() {
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
    console.log("Opening Sheet");
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
    const targetRoad = roads.find((road) =>
      road.places.some((place) => place.id === markerId)
    );

    if (!targetRoad) return;

    const isFirstPlace = targetRoad.places[0]?.id === markerId;

    if (!isFirstPlace) return;

    const clickedPlace = targetRoad.places.find((p) => p.id === markerId);
    if (clickedPlace) {
      setCoordinates(clickedPlace.coordinates);
      setZoomLevel(15);
    }

    openSheet();

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
        onMapClick={() => setActiveMarkers(getInitialMarkers())}
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
          <MapBottomSheet
            imageUrl="https://example.com/image.jpg"
            localImageSource={require("../../assets/images/historic-landmarks/statuie.png")}
            tag="15G"
            title="Historic Statue"
            description="This statue commemorates the historic events that shaped our city. Explore the area and take the quiz to learn more!"
            onStartQuiz={() => {
              console.log("Starting Quiz...");
            }}
            onContinue={() => {
              console.log("Continuing...");
              closeSheet();
            }}
          />
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
