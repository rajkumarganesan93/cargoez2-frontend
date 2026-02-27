import type { Preview } from "@storybook/react-vite";
import React from "react";
import { ThemeProvider } from "../src/utils/themeProvider";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as "light" | "dark") || "light";
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        title: "Theme",
      },
    },
  },
};

export default preview;