import { useLocationStore } from "@/store/location";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchMapView = () => {
  const BASE_URL = "http://router.project-osrm.org/route/v1/driving";

  const { end, start } = useLocationStore();
  const [routeCards, setRouteCards] = useState<LatLng[]>();
  const [loading, setLoading] = useState<boolean>();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!start || !end) {
      return;
    }

    const fetchRoute = async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL}/${start?.longitude},${start?.latitude};${end?.longitude},${end?.latitude}?overview=full&geometries=geojson`;
        const res = await axios.get(url);

        if (!res.data.routes || res.data.routes.length === 0) {
          throw new Error("No Route Found");
        }

        const coords = res.data.routes[0].geometry.coordinates.map(([lng,lat] : [number,number]) => ({
            longitude : lng,
            latitude : lat,
        }))
        
        setRouteCards(coords)

        setTimeout(() => {
            mapRef.current?.fitToCoordinates(coords,{
                edgePadding : {
                    top : 100,
                    bottom : 100,
                    right : 100,
                    left : 100,
                }
            })
        }, 300);

      } catch (error) {
        console.error("Error on Finding Routes", error);
        Alert.alert("Error", "Could not fetch route");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  if (!start || !end) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
      style={styles.map}
        ref={mapRef}
        showsUserLocation
        initialRegion={{
          latitude: start.latitude,
          longitude: start.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={start} title="Start" pinColor="green" />
        <Marker coordinate={end} title="end" pinColor="red" />

        {routeCards && routeCards.length > 0 && (
          <Polyline
            coordinates={routeCards}
            strokeColor="red"
            strokeWidth={4}
          />
        )}
      </MapView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={"large"} color={"#4F46e5"} />
        </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container : {
        flex : 1 ,

    },
    map : {
        flex : 1,
    },
    center : {
        flex : 1 ,
        justifyContent : "center",
        alignItems : "center"
    },
    loadingOverlay : {
        ...StyleSheet.absoluteFillObject,
    backgroundColor : "rgba(255,255,255,0.3)",
    justifyContent : "center",
    alignItems : "center",
    }
})

export default SearchMapView;
