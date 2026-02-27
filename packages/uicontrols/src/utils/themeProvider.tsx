import React from "react";
import DarkTheme from "../themes/darkTheme";
import LightTheme from "../themes/lightTheme";
import { ThemeContext } from "./themeContext";

export type ThemeType = "light" | "dark";

function getTheme(theme: ThemeType) {
  switch (theme) {
    case "light":
      return LightTheme;
    case "dark":
      return DarkTheme;
    default:
      return LightTheme;
  }
}

function buildCssVars(themeObj: typeof LightTheme): Record<string, string> {
  const p = themeObj.palette;
  return {
    "--color-primary": p.primary.main,
    "--color-primary-dark": p.primary.dark,
    "--color-primary-light": p.primary.light,
    "--color-primary-contrast": p.primary.contrastText,
    "--color-primary-disabled": p.primary.disabled,

    "--color-secondary": p.secondary.main,
    "--color-secondary-dark": p.secondary.dark,
    "--color-secondary-light": p.secondary.light,
    "--color-secondary-contrast": p.secondary.contrastText,
    "--color-secondary-disabled": p.secondary.disabled,

    "--color-success": p.success.main,
    "--color-success-dark": p.success.dark,
    "--color-success-light": p.success.light,
    "--color-success-contrast": p.success.contrastText,
    "--color-success-disabled": p.success.disabled,

    "--color-warning": p.warning.main,
    "--color-warning-dark": p.warning.dark,
    "--color-warning-light": p.warning.light,
    "--color-warning-contrast": p.warning.contrastText,
    "--color-warning-disabled": p.warning.disabled,

    "--color-error": p.error.main,
    "--color-error-dark": p.error.dark,
    "--color-error-light": p.error.light,
    "--color-error-contrast": p.error.contrastText,
    "--color-error-disabled": p.error.disabled,

    "--color-info": p.info.main,
    "--color-info-dark": p.info.dark,
    "--color-info-light": p.info.light,
    "--color-info-contrast": p.info.contrastText,
    "--color-info-disabled": p.info.disabled,

    "--color-bg-default": p.background.default,
    "--color-bg-paper": p.background.paper,

    "--color-text-primary": p.text.primary,
    "--color-text-secondary": p.text.secondary,
    "--color-text-disabled": p.text.disabled,

    "--color-divider": p.divider,

    "--color-action-hover": p.action.hover,
    "--color-action-focus": p.action.focus,
    "--color-action-disabled": p.action.disabled,

    "--color-grey-100": p.grey[100],
    "--color-grey-200": p.grey[200],
    "--color-grey-300": p.grey[300],
    "--color-grey-400": p.grey[400],
    "--color-grey-500": p.grey[500],
    "--color-grey-600": p.grey[600],
    "--color-grey-700": p.grey[700],
    "--color-grey-800": p.grey[800],
    "--color-grey-900": p.grey[900],

    "--shadow-light": themeObj.shadows.light,
    "--shadow-dark": themeObj.shadows.dark,

    "--font-family-base": themeObj.typography.fontFamily,
  };
}

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeType;
  children: React.ReactNode;
}) {
  const themeObj = getTheme(theme);
  const cssVars = buildCssVars(themeObj);

  return (
    <ThemeContext.Provider value={themeObj}>
      <div
        style={cssVars as React.CSSProperties}
        className="min-h-screen bg-bg-default text-text-primary p-4 font-[family-name:var(--font-family-base)]"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
