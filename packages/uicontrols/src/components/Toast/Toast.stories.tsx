import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./ToastProvider";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Toast",
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;

function ToastDemo() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Button
        label="Success Toast"
        variant="contained"
        color="success"
        onClick={() => showToast("success", "Operation completed successfully!")}
      />
      <Button
        label="Error Toast"
        variant="contained"
        color="error"
        onClick={() => showToast("error", "Something went wrong. Please try again.")}
      />
      <Button
        label="Warning Toast"
        variant="contained"
        color="warning"
        onClick={() => showToast("warning", "Please review your input before submitting.")}
      />
      <Button
        label="Info Toast"
        variant="contained"
        color="info"
        onClick={() => showToast("info", "Your session will expire in 5 minutes.")}
      />
      <Button
        label="Long Duration (8s)"
        variant="outlined"
        color="primary"
        onClick={() => showToast("info", "This toast stays for 8 seconds.", 8000)}
      />
    </div>
  );
}

export const AllVariants: StoryObj = {
  render: () => <ToastDemo />,
};
