import { useAppTheme } from "@/hooks/useAppTheme";
import { GestureResponderEvent, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

type AppTextProps = {
    leftIcon?: React.ReactNode;
    leftIconMargin?: number;
    children?: React.ReactNode;
    wrapperStyles?: StyleProp<ViewStyle>;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
    onPress?: (event: GestureResponderEvent) => void;
};

export default function AppText(props: AppTextProps) {
    const { theme } = useAppTheme();

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    padding: 0,
                    margin: 0,
                },
                props.wrapperStyles
            ]}
        >
            {!!props.leftIcon &&
                <View
                    style={{
                        justifyContent: "center",
                        padding: 0,
                        margin: 0,
                        marginRight:
                            props.leftIconMargin
                    }}
                >
                    {props.leftIcon}
                </View>
            }
            <Text
                style={[
                    {
                        color: theme.colors.text,
                        alignSelf: "center"
                    },
                    props.style,
                ]}
                numberOfLines={props.numberOfLines}
                ellipsizeMode="tail"
                onPress={props.onPress}
            >
                {props.children}
            </Text>
        </View>
    );
}
