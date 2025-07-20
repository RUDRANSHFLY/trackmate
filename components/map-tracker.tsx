import { locationType } from "@/types";
import { calculateDistance } from "@/util/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatTime } from "@/util/time";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const STORAGE_KEY = "trackmate_route";
const STORAGE_META = "trackmate_meta";

const MapTracker = () => {
  const [location, setLocation] = useState<locationType>();
  const [route, setRoute] = useState<locationType[]>([]);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const appState = useRef(AppState.currentState);

  const [tracking, setTracking] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timeRef = useRef<ReturnType<typeof setInterval>>(null);

  setTimeout(() => {
    mapRef.current?.fitToCoordinates(route);
  }, 300);

  const clearRoute = async () => {
    await AsyncStorage.removeItem("trackmate_route");
    setRoute([]);
    console.log("Route cleared");
  };

  useEffect(() => {
    const setTimer = async () => {
      const savedInfo = await AsyncStorage.getItem(STORAGE_META);
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed?.startTime != null) {
          const startTime = parseInt(parsed.startTime);
          const now = Date.now();
          console.log({
            START_TIME: startTime,
            CURRENT_TIME: now,
          });
          const diffInSeconds = Math.floor((now - startTime) / 1000);
          setElapsedTime(diffInSeconds);
          setTracking(true);
        }
      }
    };

    const handleAppStateChange = (nextAppStatus: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppStatus === "active"
      ) {
        console.log("App has come to the foreground");
        setTimer();
      }
      appState.current = nextAppStatus;
    };

    setTimer();

    AppState.addEventListener("change", handleAppStateChange);
  }, []);

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

  //? Updating the counter of the screen
  useEffect(() => {
    if (tracking) {
      timeRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timeRef.current) clearInterval(timeRef.current);
    }

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, [tracking]);

  const handleSubmit = async () => {
    if (!tracking) {
      setElapsedTime(0);
    }
    const startTime = Date.now().toString();
    await AsyncStorage.setItem(STORAGE_META, JSON.stringify({ startTime }));
    setTracking((prev) => !prev);
  };

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#1A1F2B",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.title}>Walk Tracker</Text>
      <View style={styles.map}>
        <MapView
          style={{ flex: 1, borderRadius: 100 }}
          ref={mapRef}
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
          <Marker coordinate={route[0]} pinColor="green" />
          <Marker coordinate={route[route.length - 1]} pinColor="red" />
          <Polyline coordinates={route} strokeWidth={4} strokeColor={"red"} />
        </MapView>
      </View>
      <View style={[styles.overlay]}>
        <View
          style={{
            width: 150,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 15,
          }}
        >
          <FontAwesome5 name="walking" size={24} color="white" />
          <View style={{ display: "flex", justifyContent: "center" }}>
            <Text style={styles.distance}>Distance</Text>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
              {calculateDistance(route).toFixed(2)} km
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 150,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.distance}>Distance</Text>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
            {elapsedTime != null ? formatTime(elapsedTime) : "00:00:00"}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={handleSubmit}
        style={{
          marginTop: 20,
          backgroundColor: tracking ? "#ef4444" : "#16a34a",
          width: 300,
          height: 50,
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.buttonText}>
          {tracking ? "Stop Walk" : "Start Walk"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
  map: {
    marginTop: 20,
    width: 300,
    height: 350,
    borderRadius: 100,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    marginTop: 20,
    width: 300,
    height: 70,
    borderRadius: 10,
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },
  distance: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 0,
  },
  stopColor: {
    color: "#ef4444",
  },
});

export default MapTracker;
