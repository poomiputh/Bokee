import { useAppTheme } from "@/hooks/useAppTheme";
import { DimensionValue, View } from "react-native";

export default function Separator({ height = 5 }: { height?: DimensionValue }) {
    const { theme } = useAppTheme();

    return (
        <View
            style={{
                padding: 0,
                margin: 0,
                height: height,
                backgroundColor: theme.colors.backgroundBackdrop
            }}
        >
        </View>
    );
}