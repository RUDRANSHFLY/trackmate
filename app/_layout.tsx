import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="input" />
      <Stack.Screen name="search" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
