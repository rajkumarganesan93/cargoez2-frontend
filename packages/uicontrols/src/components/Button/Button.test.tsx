import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";
import { ThemeProvider } from "../../utils/themeProvider";

describe("Button component", () => {
  const renderWithTheme = (ui: React.ReactNode, theme: "light" | "dark" = "light") =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  it("renders with label", () => {
    renderWithTheme(<Button label="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state", () => {
    renderWithTheme(<Button label="Disabled" disabled />);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("renders different variants", () => {
    renderWithTheme(<Button label="Contained" variant="contained" />);
    renderWithTheme(<Button label="Outlined" variant="outlined" />);
    renderWithTheme(<Button label="Text" variant="text" />);
    expect(screen.getByText("Contained")).toBeInTheDocument();
    expect(screen.getByText("Outlined")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
  });

  it("renders with icons", () => {
    renderWithTheme(
      <Button label="With Icons" startIcon={<span>🚀</span>} endIcon={<span>➡️</span>} />
    );
    expect(screen.getByText("🚀")).toBeInTheDocument();
    expect(screen.getByText("➡️")).toBeInTheDocument();
  });

  it("renders full width", () => {
    renderWithTheme(<Button label="Full Width" fullWidth />);
    const btn = screen.getByText("Full Width");
    expect(btn).toHaveClass("w-full");
  });
});