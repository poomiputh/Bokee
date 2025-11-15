import { useAppTheme } from "@/hooks/useAppTheme";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";

export default function Separator(props: { height?: DimensionValue, style?: StyleProp<ViewStyle> }) {
    const { theme } = useAppTheme();

    return (
        <View
            style={[
                {
                    padding: 0,
                    margin: 0,
                    marginVertical: 5,
                    height: props.height ?? 5,
                    backgroundColor: theme.colors.backgroundBackdrop
                },
                props.style
            ]}
        >
        </View>
    );
}