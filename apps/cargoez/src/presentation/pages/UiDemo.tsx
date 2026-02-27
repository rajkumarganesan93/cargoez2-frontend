import { useState } from "react";
import {
  Button,
  TextField,
  useToast,
  type ButtonVariant,
  type ButtonColor,
  type ButtonSize,
  type TextFieldVariant,
  type TextFieldSize,
} from "@rajkumarganesan93/uicontrols";
import { rules } from "@rajkumarganesan93/uifunctions";

const buttonVariants: ButtonVariant[] = ["contained", "outlined", "text"];
const buttonColors: ButtonColor[] = ["primary", "secondary", "success", "warning", "error", "info"];
const buttonSizes: ButtonSize[] = ["small", "medium", "large"];
const textFieldVariants: TextFieldVariant[] = ["outlined", "filled", "standard"];
const textFieldSizes: TextFieldSize[] = ["small", "medium", "large"];

export default function UiDemo() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    company: "",
    bio: "",
    phone: "",
    website: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-text-primary mb-8">UI Controls Demo</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          Toast Notifications
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            label="Success"
            variant="contained"
            color="success"
            onClick={() => showToast("success", "Operation completed successfully!")}
          />
          <Button
            label="Error"
            variant="contained"
            color="error"
            onClick={() => showToast("error", "Something went wrong. Please try again.")}
          />
          <Button
            label="Warning"
            variant="contained"
            color="warning"
            onClick={() => showToast("warning", "Please review your input before submitting.")}
          />
          <Button
            label="Info"
            variant="contained"
            color="info"
            onClick={() => showToast("info", "Your session will expire in 5 minutes.")}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          Button — All Variants x Colors
        </h2>
        {buttonVariants.map((variant) => (
          <div key={variant} className="mb-6">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
              {variant}
            </h3>
            <div className="flex flex-wrap gap-3">
              {buttonColors.map((color) => (
                <Button key={color} label={color} variant={variant} color={color} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          Button — Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {buttonSizes.map((size) => (
            <Button key={size} label={`${size} button`} variant="contained" color="primary" size={size} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          Button — States & Features
        </h2>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button label="Disabled Contained" variant="contained" color="primary" disabled />
          <Button label="Disabled Outlined" variant="outlined" color="secondary" disabled />
          <Button label="Disabled Text" variant="text" color="error" disabled />
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button label="With Start Icon" variant="contained" color="primary" startIcon={<span>➕</span>} />
          <Button label="With End Icon" variant="contained" color="info" endIcon={<span>→</span>} />
          <Button label="Both Icons" variant="outlined" color="success" startIcon={<span>✓</span>} endIcon={<span>→</span>} />
        </div>
        <div className="mb-4">
          <Button label="Full Width Button" variant="contained" color="primary" fullWidth />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          TextField — All Variants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {textFieldVariants.map((variant) => (
            <div key={variant}>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                {variant}
              </h3>
              <TextField
                id={`demo-${variant}`}
                label={`${variant} variant`}
                placeholder={`Type here...`}
                variant={variant}
                fullWidth
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          TextField — Sizes
        </h2>
        <div className="flex flex-col gap-4">
          {textFieldSizes.map((size) => (
            <TextField
              key={size}
              id={`demo-size-${size}`}
              label={`${size} size`}
              placeholder={`${size} text field`}
              size={size}
              fullWidth
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          TextField — Input Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField id="demo-text" label="Text" type="text" placeholder="Plain text" fullWidth />
          <TextField id="demo-email" label="Email" type="email" placeholder="user@example.com" fullWidth />
          <TextField id="demo-password" label="Password" type="password" placeholder="Enter password" fullWidth />
          <TextField id="demo-number" label="Number" type="number" placeholder="42" fullWidth />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          TextField — States
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField id="demo-disabled" label="Disabled" placeholder="Cannot edit" disabled fullWidth />
          <TextField id="demo-readonly" label="Read Only" value="Read only value" readOnly fullWidth />
          <TextField id="demo-helper" label="With Helper Text" placeholder="Type something" helperText="This is helper text" fullWidth />
          <TextField
            id="demo-error"
            label="With Error"
            value=""
            fullWidth
            validations={[rules.required("This field")]}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 border-b border-grey-300 pb-2">
          Complete Form — With Validation Rules from Package
        </h2>
        <div className="bg-bg-paper rounded-lg p-6 border border-grey-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <TextField
              id="form-fullName"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              fullWidth
              validations={[rules.required("Full name"), rules.minLength(3, "Full name"), rules.maxLength(50, "Full name")]}
            />
            <TextField
              id="form-email"
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
              validations={[rules.required("Email"), rules.email()]}
            />
            <TextField
              id="form-password"
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange("password")}
              fullWidth
              validations={[rules.required("Password"), rules.minLength(8, "Password")]}
            />
            <TextField
              id="form-age"
              label="Age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange("age")}
              fullWidth
              validations={[rules.required("Age")]}
            />
            <TextField
              id="form-company"
              label="Company"
              placeholder="Company name"
              value={formData.company}
              onChange={handleChange("company")}
              fullWidth
              variant="filled"
            />
            <TextField
              id="form-phone"
              label="Phone"
              placeholder="+1-555-0100"
              value={formData.phone}
              onChange={handleChange("phone")}
              fullWidth
              variant="filled"
              validations={[rules.pattern(/^\+?[\d\s-]{7,15}$/, "Enter a valid phone number")]}
            />
            <TextField
              id="form-website"
              label="Website"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange("website")}
              fullWidth
              variant="standard"
              helperText="Optional"
            />
            <TextField
              id="form-bio"
              label="Bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange("bio")}
              fullWidth
              variant="standard"
              validations={[rules.maxLength(200, "Bio")]}
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-grey-200">
            <Button
              label="Submit Form"
              variant="contained"
              color="primary"
              onClick={() => showToast("success", "Form submitted (demo)!")}
            />
            <Button
              label="Save Draft"
              variant="outlined"
              color="info"
              onClick={() => showToast("info", "Draft saved (demo).")}
            />
            <Button
              label="Reset"
              variant="text"
              color="warning"
              onClick={() => {
                setFormData({ fullName: "", email: "", password: "", age: "", company: "", bio: "", phone: "", website: "" });
                showToast("warning", "Form has been reset.");
              }}
            />
            <Button
              label="Cancel"
              variant="text"
              color="secondary"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
