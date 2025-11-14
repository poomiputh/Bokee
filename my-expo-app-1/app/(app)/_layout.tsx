import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { useSegments } from "expo-router";
import { Drawer } from 'expo-router/drawer';

export default function AppLayout() {
  const { theme } = useAppTheme();

  const segments = useSegments();
  const pathToHide: string[] = [
    "(books)/book/[bookId]/[page]"
  ];
  const hideHeader = pathToHide.includes(segments.join("/"));

  return (
    <NavThemeProvider value={theme}>
      <Drawer
        backBehavior="history"
        screenOptions={{
          headerTitle: 'Bokee',
          headerShown: !hideHeader,
          drawerStyle: {
            width: 240
          },
          drawerType: "front"
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="setting"
          options={{
            drawerLabel: 'Setting',
            title: 'Setting',
          }}
        />
        <Drawer.Screen
          name="(books)/book/[bookId]"
          options={{
            drawerLabel: '',
            title: '',
            drawerItemStyle: { display: 'none' }
          }}
        />
      </Drawer>
    </NavThemeProvider>
  );
}