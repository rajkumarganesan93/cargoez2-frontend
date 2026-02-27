export interface ValidationRule {
  type: "required" | "pattern" | "minLength" | "maxLength";
  value?: number | RegExp;
  message: string;
}

export const rules = {
  required: (label: string): ValidationRule => ({
    type: "required",
    message: `${label} is required`,
  }),

  email: (): ValidationRule => ({
    type: "pattern",
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  }),

  minLength: (min: number, label?: string): ValidationRule => ({
    type: "minLength",
    value: min,
    message: label
      ? `${label} must be at least ${min} characters`
      : `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, label?: string): ValidationRule => ({
    type: "maxLength",
    value: max,
    message: label
      ? `${label} must not exceed ${max} characters`
      : `Must not exceed ${max} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    type: "pattern",
    value: regex,
    message,
  }),
};
