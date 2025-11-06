import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Bokee",
          tabBarIcon: ({ color }) =>  <MaterialIcons size={28} name="home-filled" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) =>  <Ionicons size={28} name="library" color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) =>  <Ionicons name="settings-sharp" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
