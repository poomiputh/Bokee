import { SessionProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSession } from "@/hooks/useSession";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";


SplashScreen.preventAutoHideAsync();

function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}

function RootNavigator() {
  const { session } = useSession();
  const { theme } = useAppTheme();

  return (
    <NavThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider>
          <SplashScreenController />
          <RootNavigator />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider >
  );
}