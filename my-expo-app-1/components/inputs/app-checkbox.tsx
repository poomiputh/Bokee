import { useAppTheme } from "@/hooks/useAppTheme";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";
import AppText from "../texts/app-text";

export type AppCheckboxProps = {
    label: string;
    labelMargin?: DimensionValue;
    wrapperStyles?: StyleProp<ViewStyle>;
    onValueChange?: (value: boolean) => void;
};

export function AppCheckbox(props: AppCheckboxProps) {
    const { theme } = useAppTheme();
    const [isChecked, setChecked] = useState(false);

    return (
        <View style={[{ flexDirection: "row" }, props.wrapperStyles]}>
            <Checkbox
                value={isChecked}
                onValueChange={(value) => {
                    setChecked(value);
                    if (props.onValueChange) props.onValueChange(value);
                }}
                color={theme.colors.primary}
            />
            <AppText wrapperStyles={{
                marginLeft: props.labelMargin
            }}>
                {props.label}
            </AppText>
        </View>
    );
}