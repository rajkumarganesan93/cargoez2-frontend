import { createContext, useContext } from "react";
import LightTheme from "../themes/lightTheme";

export type Theme = typeof LightTheme; // infer type from your theme object

export const ThemeContext = createContext<Theme>(LightTheme);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}