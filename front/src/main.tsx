import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "flag-icons/css/flag-icons.min.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
