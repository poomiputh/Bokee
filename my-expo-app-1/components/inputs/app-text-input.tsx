import { useAppTheme } from "@/hooks/useAppTheme";
import { forwardRef } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export type AppTextInputProps = TextInputProps;

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>((props, ref) => {
    const { theme } = useAppTheme();

    const styles = StyleSheet.create({
        input: {
            height: 55,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderRadius: 6,
            padding: 10,
            color: theme.colors.text
        },
    });

    return (
        <View>
            <TextInput
                {...props}
                ref={ref}
                style={[styles.input, props.style]}   // <-- merge default + custom
            />
        </View>
    );

});