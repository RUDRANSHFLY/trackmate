# 📍 TrackMate – Smart Location Tracker & Route Finder (React Native)

This repository is the complete submission for all **3 tasks** of the React Native Assessment.

TrackMate is a clean and modern location-based app powered by React Native, enabling:
- 📌 **Offline real-time route tracking**
- 🔍 **Global route search between cities**
- 🧭 **Nearby route suggestions with dynamic bottom sheet**

---

## ✨ Features Overview

### ✅ Task 1: Offline Location Tracking
- Real-time location on the map (foreground + background)
- Red route polyline of walked path
- Automatically saves tracked data to `AsyncStorage`
- Continues offline even if internet disconnects
- “Clear Route” button to reset history

### ✅ Task 2: Global City-to-City Route Finder
- Search any global **start** and **end** city via Nominatim API
- Set markers and calculate route using OSRM
- Red polyline between points
- Auto zoom-to-fit entire route
- Uses Zustand to persist location selections

### ✅ Task 3: Nearby Route Suggestions
> As per the PDF: “Show 3 walkable route suggestions nearby in a bottom sheet with tracking option.”

- 📍 Selects a **random city** from 15 global cities (e.g., London, Tokyo, Delhi, etc.)
- 📊 Queries **Overpass API** to fetch nearby walkable footways, paths & parks
- 🗺️ Draws markers for each walkable path
- 📉 Opens a `BottomSheet` showing the top 1–10 results
- 📐 Automatically **adjusts BottomSheet height dynamically** based on number of routes
- 📌 Each card includes:
  - Title or fallback name
  - Distance from center
  - “Track This Route” button (future extensibility)

---

## 📆 Development Timeline

### ✅ Task 1: Real-Time Tracking (Offline)

| Date | Time | Work |
|------|------|------|
| **June 20, 2025** | 4:00 PM – 6:00 PM | 🔧 Set up map, live tracking, polyline drawing |
| **June 21, 2025** | Morning | ✅ Implemented background tracking with Task Manager & AsyncStorage |

### ✅ Task 2: City Search & Routing

| Date | Time | Work |
|------|------|------|
| **June 21, 2025** | 3:00 PM – 3:30 PM | ❌ OneMap API failed (SG-only) |
| **June 21, 2025** | 3:30 PM – 6:30 PM | ✅ Used OpenStreetMap Nominatim, built UI for start/end selection and routing |

### ✅ Task 3: Nearby Suggestions + Bottom Sheet

| Date | Time | Work |
|------|------|------|
| **June 21, 2025** | Late Night | ✅ Brainstormed bottom sheet suggestion idea |
| **June 22, 2025** | 3+ hours | ✅ Added Overpass integration, bottom sheet, dynamic snap height, city randomizer |

---

## 🔧 Tech Stack

| Feature | Library |
|--------|---------|
| Maps | `react-native-maps` |
| Location Tracking | `expo-location` + `expo-task-manager` |
| Local Storage | `@react-native-async-storage/async-storage` |
| Global City Search | OpenStreetMap Nominatim |
| Routing | OSRM API |
| Nearby Suggestions | Overpass API |
| Bottom Sheet | `@gorhom/bottom-sheet` |
| Navigation | `expo-router` |
| State Management | `zustand` |

---

## 🛠 Setup Instructions

```bash
git clone https://github.com/RUDRANSHFLY/trackmate.git
cd trackmate
npm install
npx expo start
```

✅ For **background tracking** or `BottomSheet`, use a **custom development build**:

```bash
npx expo run:android
# or
npx expo run:ios
```

---

## 🗂 Project Structure

```bash
.
├── app/
│   ├── index.tsx              # Main Home screen
│   ├── input.tsx              # Start/End Location Picker
│   ├── map.tsx                # Route view between locations
│   ├── search.tsx             # Nominatim-powered search screen
│   └── nearby-suggestion.tsx  # Nearby suggestion screen (Task 3)
├── components/
│   └── MapTracker.tsx         # Reusable route tracker (Task 1)
├── store/
│   └── location.ts            # Zustand location store
├── tasks/
│   └── BackgroundLocationTask.ts
├── types/
│   └── index.ts
└── README.md
```

---

## 📋 Notes

- ✅ All 3 tasks are **modular, testable and visually clean**
- 🧭 BottomSheet adjusts **dynamically** based on how many routes Overpass returns
- ✨ You can track routes live, explore new ones, or simulate travel between global cities

---

## 👤 Author

**Rudransh Ahir**  
📎 GitHub: [@RUDRANSHFLY](https://github.com/RUDRANSHFLY)

---

## ✅ Assessment Completion Summary

| Task | Completed Features |
|------|--------------------|
| ✅ Task 1 | Foreground + Background Tracking, Route Saving |
| ✅ Task 2 | City Search, Marker Placement, Route Drawing |
| ✅ Task 3 | Nearby Smart Suggestions, Dynamic Bottom Sheet Height |

---

> 💯 _All tasks completed successfully with clean UI, dynamic UX, and offline + API integrations._
