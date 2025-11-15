import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// theme/colors.ts
export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#7fb069",
        primaryContrastTex: "#ffffffff",
        background: "#f0f0f0ff",
        backgroundBackdrop: "#c0c0c0ff",
        card: "#ffffffff",
        text: "#000000ff",
        textDescription: "#585858ff",
    },
};

export const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: "#7fb069",
        primaryContrastTex: "#ffffffff",
        background: "#161616ff",
        backgroundBackdrop: "#3f3f3fff",
        card: "#161616ff",
        text: "#FFFFFF",
        textDescription: "#c2c2c2ff",
    },
};
