import { useState } from "react";
import Button from "./components/Button/Button";
import TextField from "./components/TextField/TextField";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  return (
    <div className="p-6 space-y-10 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">UIControls Demo</h1>

      {/* ---------------- BUTTONS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>

        {/* Variants */}
        <Button label="Contained Primary" variant="contained" color="primary" />
        <Button label="Outlined Secondary" variant="outlined" color="secondary" />
        <Button label="Text Success" variant="text" color="success" />

        {/* Disabled */}
        <Button label="Disabled Error" variant="contained" color="error" disabled />

        {/* Full Width */}
        <div className="w-full">
          <Button label="Full Width Info" variant="contained" color="info" fullWidth />
        </div>

        {/* With Icons */}
        <Button
          label="With Icons"
          variant="contained"
          color="primary"
          startIcon={<span>🚀</span>}
          endIcon={<span>➡️</span>}
        />

        {/* Sizes */}
        <div className="flex gap-4">
          <Button label="Small" size="small" color="primary" />
          <Button label="Medium" size="medium" color="primary" />
          <Button label="Large" size="large" color="primary" />
        </div>
      </section>

      {/* ---------------- TEXTFIELDS ---------------- */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">TextFields</h2>

        {/* Basic */}
        <TextField id="text" label="Text" type="text" placeholder="Enter text" autoFocus />

        {/* Email with validation */}
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validations={[
            { type: "required", message: "Email is required" },
            { type: "pattern", value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
          ]}
          placeholder="Enter email"
        />

        {/* Password with validation */}
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          validations={[
            { type: "required", message: "Password is required" },
            { type: "minLength", value: 6, message: "Must be at least 6 characters" },
          ]}
          placeholder="Enter password"
        />

        {/* Number with validation */}
        <TextField
          id="age"
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          validations={[
            { type: "required", message: "Age is required" },
            { type: "pattern", value: /^[0-9]+$/, message: "Only numbers allowed" },
          ]}
          placeholder="Enter age"
        />

        {/* Disabled */}
        <TextField label="Disabled Field" disabled placeholder="Disabled input" />

        {/* Full Width */}
        <TextField label="Full Width Field" fullWidth placeholder="Full width input" />

        {/* Different Sizes */}
        <div className="flex flex-col gap-4">
          <TextField label="Small" size="small" placeholder="Small size" />
          <TextField label="Medium" size="medium" placeholder="Medium size" />
          <TextField label="Large" size="large" placeholder="Large size" />
        </div>

        {/* Autofocus Demo */}
        <TextField
          id="autofocus"
          label="Autofocus Field"
          placeholder="This field auto focuses"
          autoFocus
        />
      </section>
    </div>
  );
}

export default App;