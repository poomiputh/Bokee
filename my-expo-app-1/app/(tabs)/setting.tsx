import AppText from "@/components/texts/app-text";
import { View } from "react-native";

export default function Setting() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppText>This is a Setting screen.</AppText>
    </View>
  );
}