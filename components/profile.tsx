import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const avatarUrls = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
];

const ChooseAvatarScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHOOSE YOUR LOOK</Text>
      <Text style={styles.subtitle}>You can customize it later.</Text>

      <FlatList
        data={avatarUrls}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.grid}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.avatarWrapper,
              selectedIndex === index && styles.selectedAvatar,
            ]}
            onPress={() => setSelectedIndex(index)}
          >
            <Image source={{ uri: item }} style={styles.avatar} />
          </TouchableOpacity>
        )}
      />

      {selectedIndex !== null && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C1F7F5",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    color: "#444",
  },
  grid: {
    alignItems: "center",
  },
  avatarWrapper: {
    margin: 10,
    borderRadius: 50,
    padding: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "#00BCD4",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00BCD4",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ChooseAvatarScreen;
