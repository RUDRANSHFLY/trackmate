import { BackgroundLocationTrackerData, locationType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from 'expo-task-manager';

const STORAGE_KEY = "trackmate_route";
const BACKGROUND_LOCATION_TRACKER_IDENTIFIER = "background-location-task";


TaskManager.defineTask(BACKGROUND_LOCATION_TRACKER_IDENTIFIER , async ({data,error} : {
  data? : BackgroundLocationTrackerData;
  error? : any
}) => {
  if(error){
    console.error('BackGround Tracker Error : ',error)
    return;
  }

  if(data){
    const { locations } = data

    if(!locations || locations.length === 0){
      return;
    }

    const newLoc : Location.LocationObject = locations[0] ;
    const {latitude , longitude} = newLoc.coords;
   
    const newCordinates = {latitude,longitude}

    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY)
      const route : locationType[] = saved ? JSON.parse(saved) : [];
      route.push(newCordinates);
      await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(route))
    } catch (err) {
      console.error("Failed to save background location",err)
    }
  }
})




