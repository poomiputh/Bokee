import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Details",
        }}
      />
      <Stack.Screen
        name="[page]"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}