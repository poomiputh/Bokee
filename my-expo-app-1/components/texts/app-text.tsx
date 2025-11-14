import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

type AppTextProps = {
    leftIcon?: React.ReactNode;
    leftIconMargin?: number;
    children?: React.ReactNode;
    wrapperStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
};

export default function AppText(props: AppTextProps) {
    const { theme } = useAppTheme();

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    padding: 0,
                    margin: 0
                },
                props.wrapperStyle
            ]}
        >
            {!!props.leftIcon &&
                <View style={{ justifyContent: "center", padding: 0, marginRight: props.leftIconMargin }}>
                    {props.leftIcon}
                </View>
            }
            <Text
                style={[
                    {
                        color: theme.colors.text,
                    },
                    props.style,
                ]}
                numberOfLines={props.numberOfLines}
                ellipsizeMode="tail"
            >
                {props.children}
            </Text>
        </View>
    );
}
