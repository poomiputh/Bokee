import { useAppTheme } from "@/hooks/useAppTheme";
import { ButtonProps, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppText from "../texts/app-text";

export type AppButtonCircularProps = ButtonProps & {
    style?: StyleProp<ViewStyle>;
};

export default function AppButtonCicular(props: AppButtonCircularProps) {
    const { theme } = useAppTheme();

    const styles = StyleSheet.create({
        button: {
            backgroundColor: theme.colors.primary,
            borderRadius: "50%",
            aspectRatio: 1,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        buttonPressed: {
            backgroundColor: theme.colors.primary,
            opacity: 0.7,
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
        },
    });

    return (
        <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed, // style when pressed
                props.style
            ]}
        >
            <AppText style={styles.buttonText}>
                {props.title}
            </AppText>
        </Pressable>
    );
}