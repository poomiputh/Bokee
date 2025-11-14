import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "none",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Book Details",
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