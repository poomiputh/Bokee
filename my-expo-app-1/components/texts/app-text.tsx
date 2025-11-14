import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleProp, Text, TextStyle } from "react-native";

type AppTextProps = {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
};

export default function AppText(props: AppTextProps) {
    const { theme } = useAppTheme();

    return (
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
    );
}
