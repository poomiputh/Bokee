import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useNavigation, usePathname } from "expo-router";
import { useEffect } from 'react';

export default function TabLayout() {
  const navigation = useNavigation();
  const pathName = usePathname();

  const pathNameMap: Map<string, string> = new Map([
    ["/", "Bokee"],
    ["/library", "Public Library"],
    ["/account", "Your Account"]
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: pathNameMap.get(pathName)
    })
  }, [pathName]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Bokee",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home-filled" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <Ionicons size={28} name="library" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "You",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account" color={color} />,
        }}
      />
    </Tabs>
  );
}
