import { useLocationStore } from "@/store/location";
import { SerachResult } from "@/types";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Search = () => {
  const router = useRouter();
  const { field } = useLocalSearchParams();
  const BASE_URL = "https://nominatim.openstreetmap.org/search";

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SerachResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { setEnd, setStart } = useLocationStore();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(BASE_URL, {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 10,
          },
          headers: {
            "User-Agent": "TrackMateApp/1.0", 
          },
        });

        setResults(res.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (item: SerachResult) => {
    const loc = {
      name: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    };

    if (field === "start") {
      setStart(loc);
    }
    if (field === "end") {
      setEnd(loc);
    }

    router.replace("/input");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Search {field === "start" ? "Start" : "End"} Location
      </Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Type a Location..."
        style={styles.input}
      />

      {loading && <ActivityIndicator size={"large"} />}

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.display_name}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelect(item)}
          >
            <Text>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default Search;
