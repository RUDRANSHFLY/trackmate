import { LocationObject } from "expo-location";

export type locationType = {
  latitude: number;
  longitude: number;
};

export interface BackgroundLocationTrackerData{
    locations  : LocationObject[];
}

