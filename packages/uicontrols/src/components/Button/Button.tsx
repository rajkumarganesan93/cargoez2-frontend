import React, { forwardRef } from "react";

export type ButtonVariant = "contained" | "outlined" | "text";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface ButtonProps {
  id?: string;
  name?: string;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
}

const sizeClasses: Record<ButtonSize, string> = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

const colorContainedClasses: Record<ButtonColor, string> = {
  primary: "bg-primary text-primary-contrast shadow-light disabled:bg-primary-disabled",
  secondary: "bg-secondary text-secondary-contrast shadow-light disabled:bg-secondary-disabled",
  success: "bg-success text-success-contrast shadow-light disabled:bg-success-disabled",
  warning: "bg-warning text-warning-contrast shadow-light disabled:bg-warning-disabled",
  error: "bg-error text-error-contrast shadow-light disabled:bg-error-disabled",
  info: "bg-info text-info-contrast shadow-light disabled:bg-info-disabled",
};

const colorOutlinedClasses: Record<ButtonColor, string> = {
  primary: "border-2 border-primary text-primary bg-transparent",
  secondary: "border-2 border-secondary text-secondary bg-transparent",
  success: "border-2 border-success text-success bg-transparent",
  warning: "border-2 border-warning text-warning bg-transparent",
  error: "border-2 border-error text-error bg-transparent",
  info: "border-2 border-info text-info bg-transparent",
};

const colorTextClasses: Record<ButtonColor, string> = {
  primary: "text-primary bg-transparent border-none",
  secondary: "text-secondary bg-transparent border-none",
  success: "text-success bg-transparent border-none",
  warning: "text-warning bg-transparent border-none",
  error: "text-error bg-transparent border-none",
  info: "text-info bg-transparent border-none",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      id,
      name,
      label,
      variant = "contained",
      size = "medium",
      color = "primary",
      disabled = false,
      fullWidth = false,
      startIcon,
      endIcon,
      onClick,
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:text-text-disabled";

    const variantClasses =
      variant === "contained"
        ? colorContainedClasses[color]
        : variant === "outlined"
          ? colorOutlinedClasses[color]
          : colorTextClasses[color];

    const classes = [
      base,
      sizeClasses[size],
      variantClasses,
      fullWidth ? "w-full" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        id={id}
        name={name}
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={classes}
      >
        {startIcon}
        {label}
        {endIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
