import { locationType } from "@/types";
import { calculateDistance } from "@/util/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "trackmate_route";

const MapTracker = () => {
  const [location, setLocation] = useState<locationType>();
  const [route, setRoute] = useState<locationType[]>([]);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  setTimeout(() => {
    mapRef.current?.fitToCoordinates(route, {
      edgePadding: {
        top: 100,
        bottom: 100,
        right: 100,
        left: 100,
      },
    });
  }, 300);

  const clearRoute = async () => {
    await AsyncStorage.removeItem("trackmate_route");
    setRoute([]);
    console.log("Route cleared");
  };

  //? Accessing Location Permission
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
    <SafeAreaView style={{ flex: 1 }}>
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
        mapPadding={{
          top: 50,
          left: 50,
          right: 50,
          bottom: 50,
        }}
      >
        <Polyline coordinates={route} strokeWidth={4} strokeColor={"red"} />
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.distance}>
          Walked : {calculateDistance(route).toFixed(2)} km
        </Text>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/nearby-suggestion')}>
            <Text style={styles.buttonText}>Nearby Parks</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.button} onPress={clearRoute}>
            <Text style={styles.buttonText}>Clear Path</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4F46E5" }]}
            onPress={() => router.push("/input")}
          >
            <Text style={styles.buttonText}>Search Route</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  overlay: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  distance: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 0,
  },
});

export default MapTracker;
