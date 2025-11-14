import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// theme/colors.ts
export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#2b8562ff",
        background: "#f0f0f0ff",
        card: "#ffffffff",
        text: "#000000ff",
        textDescription: "#585858ff",
    },
};

export const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: "#2b8562ff",
        background: "#161616ff",
        card: "#161616ff",
        text: "#FFFFFF",
        textDescription: "#c2c2c2ff",
    },
};
