import { locationType } from "@/types";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

// 🔁 Randomly pick a city from this list
const CITIES = [
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { name: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { name: "New York", latitude: 40.7128, longitude: -74.006 },
  { name: "London", latitude: 51.5072, longitude: -0.1276 },
  { name: "Berlin", latitude: 52.52, longitude: 13.405 },
  { name: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
  { name: "Barcelona", latitude: 41.3851, longitude: 2.1734 },
  { name: "Dubai", latitude: 25.276987, longitude: 55.296249 },
  { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
  { name: "Seoul", latitude: 37.5665, longitude: 126.978 },
  { name: "Istanbul", latitude: 41.0082, longitude: 28.9784 },
  { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
];

export default function NearbyRoutes() {
  const [location, setLocation] = useState<locationType>();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("");
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => {
    if (places.length === 1) return ["15%", "30%"];
    if (places.length === 2) return ["25%", "40%"];
    if (places.length === 3) return ["35%", "55%"];
    return ["45%", "75%"]; // 3 or more
  }, [places]);

  const getDistanceFromLatLonInKm = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  useEffect(() => {
    const fetchNearbyRoutes = async (
      coords: locationType,
      cityName: string
    ) => {
      const query = `
        [out:json];
        (
          way["highway"="footway"](around:1000,${coords.latitude},${coords.longitude});
          way["highway"="path"](around:1000,${coords.latitude},${coords.longitude});
          way["leisure"="park"](around:1000,${coords.latitude},${coords.longitude});
        );
        out center;
      `;

      try {
        const res = await axios.post(
          "https://overpass-api.de/api/interpreter",
          `data=${encodeURIComponent(query)}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const elements = res.data.elements.map((el: any) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          const dist = getDistanceFromLatLonInKm(
            coords.latitude,
            coords.longitude,
            lat,
            lon
          );
          return { ...el, lat, lon, distance: dist };
        });

        const randomCount = Math.floor(Math.random() * 10) + 1; // random between 1–10
        setPlaces(elements.slice(0, randomCount));

        setCity(cityName);
      } catch (err) {
        console.error("Overpass error", err);
      } finally {
        setLoading(false);
      }
    };

    const random = Math.floor(Math.random() * CITIES.length);
    const picked = CITIES[random];
    setLocation(picked);
    fetchNearbyRoutes(picked, picked.name);
  }, [getDistanceFromLatLonInKm]);

  if (!location) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title={`📍 ${city}`} />
        {places.map((place, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: place.lat, longitude: place.lon }}
            title={place.tags?.name || `Route ${i + 1}`}
          />
        ))}
      </MapView>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose
      >
        <BottomSheetView
          style={{ padding: 16, flex: 1, backgroundColor: "yellow" }}
        >
          <Text style={styles.sheetTitle}>
            🧭 Nearby Route Suggestions ({city})
          </Text>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={places}
              keyExtractor={(item, i) => item.id?.toString() || i.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.name}>
                    {item.tags?.name || "Unnamed Route"}
                  </Text>
                  <Text style={styles.meta}>
                    📍 {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
                  </Text>
                  <Text style={styles.meta}>
                    📏 {item.distance.toFixed(2)} km away
                  </Text>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>📌 Track This Route</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#444",
  },
  button: {
    backgroundColor: "#4F46E5",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
