import { LocationObject } from "expo-location";

export type locationType = {
  latitude: number;
  longitude: number;
};

export type SerachResult = {
  display_name : string,
  lat : string,
  lon : string,
}

export interface Coordinates extends locationType{
  name : string,
}

export interface BackgroundLocationTrackerData{
    locations  : LocationObject[];
}

