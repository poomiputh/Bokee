import { ThemeContext } from "@/context/theme-context";
import { useContext } from "react";

export const useAppTheme = () => useContext(ThemeContext);