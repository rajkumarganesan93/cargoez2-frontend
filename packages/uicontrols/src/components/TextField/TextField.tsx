import React, { forwardRef } from "react";

export type TextFieldVariant = "outlined" | "filled" | "standard";
export type TextFieldSize = "small" | "medium" | "large";
export type TextFieldType = "text" | "email" | "password" | "number";

export interface ValidationRule {
  type: "required" | "pattern" | "minLength" | "maxLength";
  value?: number | RegExp;
  message: string;
}

export interface TextFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: TextFieldType;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: TextFieldSize;
  variant?: TextFieldVariant;
  validations?: ValidationRule[];
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  autoFocus?: boolean;
}

const sizeClasses: Record<TextFieldSize, string> = {
  small: "px-2 py-1 text-sm",
  medium: "px-3 py-2 text-base",
  large: "px-4 py-3 text-lg",
};

const widthClasses: Record<TextFieldSize, string> = {
  small: "w-48",
  medium: "w-72",
  large: "w-96",
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      value,
      defaultValue,
      type = "text",
      disabled = false,
      fullWidth = false,
      size = "medium",
      variant = "outlined",
      validations = [],
      helperText,
      onChange,
      onKeyDown,
      onBlur,
      readOnly = false,
      autoFocus = false,
    },
    ref
  ) => {
    let errorMessage: string | null = null;
    if (validations.length && value !== undefined) {
      for (const rule of validations) {
        if (rule.type === "required" && !value) {
          errorMessage = rule.message;
          break;
        }
        if (rule.type === "pattern" && rule.value instanceof RegExp && !rule.value.test(value)) {
          errorMessage = rule.message;
          break;
        }
        if (rule.type === "minLength" && typeof rule.value === "number" && value.length < rule.value) {
          errorMessage = rule.message;
          break;
        }
        if (rule.type === "maxLength" && typeof rule.value === "number" && value.length > rule.value) {
          errorMessage = rule.message;
          break;
        }
      }
    }

    const baseInput =
      "rounded-md transition-all duration-200 outline-none font-[family-name:var(--font-family-base)] text-text-primary disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = (() => {
      switch (variant) {
        case "outlined":
          return errorMessage
            ? "border border-error"
            : "border border-grey-400 focus:border-primary";
        case "filled":
          return errorMessage
            ? "bg-grey-100 border-b-2 border-b-error"
            : "bg-grey-100 border-b-2 border-b-grey-400 focus:border-b-primary";
        case "standard":
          return errorMessage
            ? "border-b border-b-error"
            : "border-b border-b-grey-500 focus:border-b-primary";
      }
    })();

    const inputClasses = [
      baseInput,
      sizeClasses[size],
      variantClasses,
      fullWidth ? "w-full" : widthClasses[size],
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col mb-4">
        {label && (
          <label
            htmlFor={id}
            className="font-semibold text-sm text-text-primary disabled:text-text-disabled mb-1 font-[family-name:var(--font-family-base)]"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          name={name}
          ref={ref}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          aria-invalid={!!errorMessage}
          aria-describedby={helperText ? `${id}-helper-text` : undefined}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className={inputClasses}
        />
        {(helperText || errorMessage) && (
          <span
            id={`${id}-helper-text`}
            className={`text-xs mt-1 font-[family-name:var(--font-family-base)] ${
              errorMessage ? "text-error" : "text-text-secondary"
            }`}
          >
            {errorMessage || helperText}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
