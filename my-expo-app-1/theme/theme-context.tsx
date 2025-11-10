import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "./colors";

const ThemeContext = createContext({
    theme: lightTheme,
    toggleTheme: () => { },
    rootHeaderShown: true,
    toggleRootHeader: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === "dark");
    const [rootHeaderShown, setRootHeaderShown] = useState(true);

    const toggleTheme = () => setIsDark((prev) => !prev);
    const theme = isDark ? darkTheme : lightTheme;

    const toggleRootHeader = () => setRootHeaderShown((prev) => !prev);

    useEffect(() => {
        setIsDark(systemScheme === "dark");
    }, [systemScheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, rootHeaderShown, toggleRootHeader }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);