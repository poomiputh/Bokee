import { useAppTheme } from "@/hooks/useAppTheme";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { useSegments } from "expo-router";
import { Drawer } from 'expo-router/drawer';

export default function AppLayout() {
  const { theme } = useAppTheme();

  const segments = useSegments();
  console.log(segments);
  const pathToHide: string[] = [
    "(app)/(books)/book/[bookId]/[page]",
    "(app)/(books)/book/[bookId]"
  ];
  const hideHeader = pathToHide.includes(segments.join("/"));

  return (
    <NavThemeProvider value={theme}>
      <Drawer
        backBehavior="history"
        screenOptions={{
          // headerTitle: 'Bokee :^)',
          headerSearchBarOptions: {},
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
            drawerIcon: ({ color }) => <MaterialIcons size={28} name="home-filled" color={color} />
          }}
        />
        <Drawer.Screen
          name="setting"
          options={{
            drawerLabel: 'Setting',
            title: 'Setting',
            drawerIcon: ({ color }) => <Ionicons name="settings-sharp" size={28} color={color} />
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