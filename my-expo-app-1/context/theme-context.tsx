import { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../theme/colors";

export const ThemeContext = createContext({
    theme: lightTheme,
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === "dark");

    const toggleTheme = () => setIsDark((prev) => !prev);
    const theme = isDark ? darkTheme : lightTheme;

    useEffect(() => {
        setIsDark(systemScheme === "dark");
    }, [systemScheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};