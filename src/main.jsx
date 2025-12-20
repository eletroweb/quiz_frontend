import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Suppress MetaMask and other wallet errors
window.addEventListener("error", (event) => {
  if (
    event.message?.includes("MetaMask") ||
    event.message?.includes("ethereum") ||
    event.message?.includes("inpage")
  ) {
    event.preventDefault();
  }
});

// Suppress unhandled promise rejections for MetaMask
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason?.message?.includes("MetaMask") ||
    event.reason?.message?.includes("ethereum") ||
    event.reason?.message?.includes("Failed to connect")
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
