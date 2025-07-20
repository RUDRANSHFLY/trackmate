import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function AvatarMap() {
  const avatars = [
    {
      id: 1,
      name: 'Agent Neo',
      coordinate: { latitude: 19.117, longitude: 72.833 },
      icon: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      name: 'Captain Zara',
      coordinate: { latitude: 19.118, longitude: 72.8345 },
      icon: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      name: 'Scout Kai',
      coordinate: { latitude: 19.116, longitude: 72.832 },
      icon: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ];

  const initialRegion = {
    latitude: 19.117,
    longitude: 72.833,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsCompass
        mapType="standard"
      >
        {avatars.map((avatar) => (
          <Marker key={avatar.id} coordinate={avatar.coordinate}>
            <View style={styles.markerWrapper}>
              <Image source={{ uri: avatar.icon }} style={styles.avatarIcon} />
              <Text style={styles.avatarName}>{avatar.name}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  markerWrapper: {
    alignItems: 'center',
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    padding: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  avatarIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#1e88e5',
  },
  avatarName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
