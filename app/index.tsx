import MapTracker from '@/components/map-tracker'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MapTracker />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container : {
    flex : 1,
  }
})