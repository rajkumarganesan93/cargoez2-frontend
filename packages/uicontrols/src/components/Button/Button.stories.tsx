
import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    label: "Click Me",
    variant: "contained",
    size: "medium",
    color: "primary",
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["contained", "outlined", "text"],
    },
    size: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
    },
    color: {
      control: { type: "radio" },
      options: ["primary", "secondary", "success", "warning", "error", "info"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Contained: Story = {
  args: { label: "Contained Button", variant: "contained", color: "primary" },
};

export const Outlined: Story = {
  args: { label: "Outlined Button", variant: "outlined", color: "secondary" },
};

export const Text: Story = {
  args: { label: "Text Button", variant: "text", color: "success" },
};

export const Disabled: Story = {
  args: { label: "Disabled Button", variant: "contained", color: "error", disabled: true },
};

export const FullWidth: Story = {
  args: { label: "Full Width Button", variant: "contained", color: "info", fullWidth: true },
};

export const WithIcons: Story = {
  args: {
    label: "Button with Icons",
    variant: "contained",
    color: "primary",
    startIcon: <span>🚀</span>,
    endIcon: <span>➡️</span>,
  },
};