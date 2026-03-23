import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>

    <Stack.Screen 
    name="index" 
    options={{
      title: "Anime Hub",
      headerTitleAlign: "center",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "rgb(23, 18, 31)",
      },
      headerTitleStyle: {
        color: "rgba(255, 255, 255, 0.5)"
      },
    }} />

    <Stack.Screen 
    name="aniDetailScreen" 
    options={{
      title: "Anime Details",
      presentation: "modal"
    }} />
  </Stack>
  );
}
