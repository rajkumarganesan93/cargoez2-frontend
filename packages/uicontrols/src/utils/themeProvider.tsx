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
    "--theme-primary": p.primary.main,
    "--theme-primary-dark": p.primary.dark,
    "--theme-primary-light": p.primary.light,
    "--theme-primary-contrast": p.primary.contrastText,
    "--theme-primary-disabled": p.primary.disabled,

    "--theme-secondary": p.secondary.main,
    "--theme-secondary-dark": p.secondary.dark,
    "--theme-secondary-light": p.secondary.light,
    "--theme-secondary-contrast": p.secondary.contrastText,
    "--theme-secondary-disabled": p.secondary.disabled,

    "--theme-success": p.success.main,
    "--theme-success-dark": p.success.dark,
    "--theme-success-light": p.success.light,
    "--theme-success-contrast": p.success.contrastText,
    "--theme-success-disabled": p.success.disabled,

    "--theme-warning": p.warning.main,
    "--theme-warning-dark": p.warning.dark,
    "--theme-warning-light": p.warning.light,
    "--theme-warning-contrast": p.warning.contrastText,
    "--theme-warning-disabled": p.warning.disabled,

    "--theme-error": p.error.main,
    "--theme-error-dark": p.error.dark,
    "--theme-error-light": p.error.light,
    "--theme-error-contrast": p.error.contrastText,
    "--theme-error-disabled": p.error.disabled,

    "--theme-info": p.info.main,
    "--theme-info-dark": p.info.dark,
    "--theme-info-light": p.info.light,
    "--theme-info-contrast": p.info.contrastText,
    "--theme-info-disabled": p.info.disabled,

    "--theme-bg-default": p.background.default,
    "--theme-bg-paper": p.background.paper,

    "--theme-text-primary": p.text.primary,
    "--theme-text-secondary": p.text.secondary,
    "--theme-text-disabled": p.text.disabled,

    "--theme-divider": p.divider,

    "--theme-action-hover": p.action.hover,
    "--theme-action-focus": p.action.focus,
    "--theme-action-disabled": p.action.disabled,

    "--theme-grey-100": p.grey[100],
    "--theme-grey-200": p.grey[200],
    "--theme-grey-300": p.grey[300],
    "--theme-grey-400": p.grey[400],
    "--theme-grey-500": p.grey[500],
    "--theme-grey-600": p.grey[600],
    "--theme-grey-700": p.grey[700],
    "--theme-grey-800": p.grey[800],
    "--theme-grey-900": p.grey[900],

    "--theme-shadow-light": themeObj.shadows.light,
    "--theme-shadow-dark": themeObj.shadows.dark,

    "--theme-font-family": themeObj.typography.fontFamily,
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
        className="min-h-screen bg-bg-default text-text-primary p-4 font-[family-name:var(--theme-font-family)]"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
