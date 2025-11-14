import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";

export default function TabLayout() {
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
        name="account"
        options={{
          title: "You",
          tabBarIcon: ({ color }) =>  <MaterialCommunityIcons size={28} name="account" color={color} />,
        }}
      />
    </Tabs>
  );
}
