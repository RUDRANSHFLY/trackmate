import { useLocationStore } from "@/store/location";
import { useRouter } from "expo-router";

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InputScreen = () => {
  const router = useRouter();

  const { start, end,  } = useLocationStore();

  const handleSearch = (field: "start" | "end") => {
    router.push({
      pathname: "/search",
      params: {
        field,
      },
    });
  };

  const handleShowRoute = () => {
   router.push('/map')
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Route Finder</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSearch("start")}
      >
        <Text style={styles.buttonText}>
          {start ? `Start : ${start.name}` : "Select Start Location"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSearch("end")}
      >
        <Text style={styles.buttonText}>
          {end ? `End : ${end.name}` : "Select Start Location"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleShowRoute}
        style={[styles.button, !(start && end) && styles.disabled]}
        disabled={!(start && end)}
      >
        <Text style={styles.buttonText}>Show Routes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 36,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  disabled: {
    backgroundColor: "#aaa",
  },
});

export default InputScreen;
