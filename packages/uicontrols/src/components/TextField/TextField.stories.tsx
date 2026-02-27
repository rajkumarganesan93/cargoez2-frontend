import type { Meta, StoryObj } from '@storybook/react-vite';
import TextField from "./TextField";
import { useState } from "react";

const meta: Meta<typeof TextField> = {
  title: "UI/TextField",
  component: TextField,
  args: {
    id: "field",
    name: "field",
    label: "Label",
    placeholder: "Enter value",
    variant: "outlined",
    size: "medium",
    type: "text",
    disabled: false,
    fullWidth: false,
    helperText: "",
    autoFocus: false,
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["outlined", "filled", "standard"],
    },
    size: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
    },
    type: {
      control: { type: "radio" },
      options: ["text", "email", "password", "number"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    autoFocus: { control: "boolean" },
    onChange: { action: "changed" },
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;
type Args = Story["args"];

/**
 * General text field
 */
export const TextFieldBasic: Story = {
  args: {
    id: "text",
    label: "Text",
    type: "text",
    placeholder: "Enter text",
    autoFocus: true, // ✅ autofocus demo
  },
};

/**
 * Email field with validation
 */
export const EmailField = (args: Args = {}) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  return (
    <TextField
      {...args}
      id="email"
      label="Email"
      type="email"
      value={value}
      onChange={handleChange}
      validations={[
        { type: "required", message: "Email is required" },
        { type: "pattern", value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
      ]}
      placeholder="Enter email"
    />
  );
};

/**
 * Password field with validation
 */
export const PasswordField = (args: Args = {}) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  return (
    <TextField
      {...args}
      id="password"
      label="Password"
      type="password"
      value={value}
      onChange={handleChange}
      validations={[
        { type: "required", message: "Password is required" },
        { type: "minLength", value: 6, message: "Must be at least 6 characters" },
      ]}
      placeholder="Enter password"
    />
  );
};

/**
 * Number field with validation
 */
export const NumberField = (args: Args = {}) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  return (
    <TextField
      {...args}
      id="age"
      label="Age"
      type="number"
      value={value}
      onChange={handleChange}
      validations={[
        { type: "required", message: "Age is required" },
        { type: "pattern", value: /^[0-9]+$/, message: "Only numbers allowed" },
      ]}
      placeholder="Enter number"
    />
  );
};

/** 
 * Disabled field 
 */
export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    disabled: true,
    placeholder: "Disabled input",
  },
};

/**
 * Full width field
 */
export const FullWidth: Story = {
  args: {
    label: "Full Width Field",
    fullWidth: true,
    placeholder: "Full width input",
  },
};

/**
 * Different sizes
 */
export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TextField label="Small" size="small" placeholder="Small size" />
      <TextField label="Medium" size="medium" placeholder="Medium size" />
      <TextField label="Large" size="large" placeholder="Large size" />
    </div>
  ),
};

/**
 * Autofocus demo
 */
export const AutoFocusDemo: Story = {
  args: {
    id: "autofocus",
    label: "Autofocus Field",
    placeholder: "This field auto focuses",
    autoFocus: true, // ✅ new prop demo
  },
};