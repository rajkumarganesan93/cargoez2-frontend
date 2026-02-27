import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import TextField from "./TextField";

describe("TextField component", () => {
  it("renders with label and placeholder", () => {
    render(<TextField id="username" label="Username" placeholder="Enter username" />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("shows helper text when provided", () => {
    render(<TextField id="email" label="Email" helperText="We will not share your email" />);
    expect(screen.getByText("We will not share your email")).toBeInTheDocument();
  });

  it("fires onChange event", () => {
    const handleChange = vi.fn();
    render(<TextField id="field" label="Field" onChange={handleChange} />);
    const input = screen.getByLabelText("Field");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("shows required validation error", () => {
    render(
      <TextField
        id="required"
        label="Required"
        value=""
        readOnly
        validations={[{ type: "required", message: "This field is required" }]}
      />
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("shows pattern validation error", () => {
    render(
      <TextField
        id="pattern"
        label="Pattern"
        value="abc"
        readOnly
        validations={[{ type: "pattern", value: /^[0-9]+$/, message: "Only numbers allowed" }]}
      />
    );
    expect(screen.getByText("Only numbers allowed")).toBeInTheDocument();
  });

  it("shows minLength validation error", () => {
    render(
      <TextField
        id="password"
        label="Password"
        value="123"
        readOnly
        validations={[{ type: "minLength", value: 6, message: "Must be at least 6 characters" }]}
      />
    );
    expect(screen.getByText("Must be at least 6 characters")).toBeInTheDocument();
  });

  it("shows maxLength validation error", () => {
    render(
      <TextField
        id="nickname"
        label="Nickname"
        value="toolongname"
        readOnly
        validations={[{ type: "maxLength", value: 5, message: "Too long" }]}
      />
    );
    expect(screen.getByText("Too long")).toBeInTheDocument();
  });

  it("applies disabled state", () => {
    render(<TextField id="disabled" label="Disabled" disabled />);
    const input = screen.getByLabelText("Disabled");
    expect(input).toBeDisabled();
  });

  it("forwards ref to input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TextField id="ref" label="Ref Test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies autoFocus when set", () => {
    render(<TextField id="focus" label="Focus Test" autoFocus />);
    const input = screen.getByLabelText("Focus Test");
    expect(document.activeElement).toBe(input);
  });
});