import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";

const STORAGE_KEY = "trackmate_route";

type locationType = {
  latitude: number;
  longitude: number;
};

const MapTracker = () => {
  const [location, setLocation] = useState<locationType>();
  const [route, setRoute] = useState<locationType[]>([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const requestPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      await Location.startLocationUpdatesAsync("background-location-task", {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
        timeInterval: 5000,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "TrackMate is running",
          notificationBody: "Tracking your location in background",
        },
      });

      const savedRoute = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedRoute) {
        setRoute(JSON.parse(savedRoute));
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;

          const newCoord = { latitude, longitude };
          setLocation(newCoord);

          setRoute((prev) => {
            const updated = [...prev, newCoord];
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      );
    };

    requestPermission();
  }, []);

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        ...location,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      }}
      cameraZoomRange={{
        minCenterCoordinateDistance: 50,
        maxCenterCoordinateDistance: 100,
        animated: true,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
    >
      <Polyline coordinates={route} strokeWidth={4} strokeColor={"red   "} />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapTracker;
