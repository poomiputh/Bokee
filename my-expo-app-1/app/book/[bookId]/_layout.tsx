import { Stack } from "expo-router";

export default function StackLayout() {
  return (

    <Stack
      screenOptions={{
        animation: "none",
        animationTypeForReplace: "pop",
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