import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSegments } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import { Image } from 'react-native';

export default function AppLayout() {
  const segments = useSegments();
  console.log(segments);
  const pathToHide: string[] = [
    "(app)/(books)/book/[bookId]/[page]",
    "(app)/(books)/book/[bookId]"
  ];
  const hideHeader = pathToHide.includes(segments.join("/"));

  return (
    <Drawer
      backBehavior="history"
      screenOptions={{
        // headerTitle: titleMap.get(currentTab) ?? "Bokee",
        // headerSearchBarOptions: {},
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
          headerRight: () => {
            return (
              <Image style={{ width: 45, height: 45, marginHorizontal: 10 }} source={require("../../assets/icons/logo.png")} />
            );
          },
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
  );
}