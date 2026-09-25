import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { makeServer } from "./mirage/server";

if (import.meta.env.DEV) {
  makeServer();

  // fetch("/api/users")
  //   .then((response) => response.json())
  //   .then((data) => console.log("Mirage verification:", data))
  //   .catch((error) => console.error("Mirage verification failed:", error));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);