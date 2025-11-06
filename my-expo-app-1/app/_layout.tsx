import { ThemeProvider, useAppTheme } from "@/theme/theme-context";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

function InnerLayout() {
  const { theme } = useAppTheme();

  return (
    <NavThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          animationTypeForReplace: "pop",
        }}
      />
    </NavThemeProvider>
  );
}

export default function StackLayout() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InnerLayout />
      </ThemeProvider>
    </QueryClientProvider >
  );
}