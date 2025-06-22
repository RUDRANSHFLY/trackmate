import BottomSheet from "@/components/bottom-sheet";
import { locationType } from "@/types";
import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function NearbyRoutes() {
  const [location, setLocation] = useState<locationType>();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchNearbyRoutes(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  const fetchNearbyRoutes = async (lat: number, lng: number) => {
    const query = `
      [out:json];
      (
        way["highway"="footway"](around:1000,${lat},${lng});
        way["highway"="path"](around:1000,${lat},${lng});
        way["leisure"="park"](around:1000,${lat},${lng});
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
        const dist = getDistanceFromLatLonInKm(location.latitude, location.longitude, lat, lon);
        return { ...el, lat, lon, distance: dist };
      });
      setPlaces(elements.slice(0, 3));
    } catch (err) {
      console.error("Overpass error", err);
    } finally {
      setLoading(false);
    }
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

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
        <Marker coordinate={location} title="You are here" />
        {places.map((place, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: place.lat, longitude: place.lon }}
            title={place.tags?.name || `Route ${i + 1}`}
          />
        ))}
      </MapView>

      <BottomSheet visible={true}>
        <Text style={styles.sheetTitle}>🧭 Nearby Route Suggestions</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item, i) => item.id?.toString() || i.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>{item.tags?.name || "Unnamed Route"}</Text>
                <Text style={styles.meta}>📍 {item.lat.toFixed(4)}, {item.lon.toFixed(4)}</Text>
                <Text style={styles.meta}>📏 {item.distance.toFixed(2)} km away</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>📌 Track This Route</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
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
