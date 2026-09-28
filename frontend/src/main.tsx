import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/react";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <ClerkProvider
        publishableKey={
          "pk_test_dG91Y2hlZC1zaGVwaGVyZC05MDc5LmNsZXJrLmFjY291bnRzLmRldiQ"
        }
      >
        <App />
      </ClerkProvider>
    </StrictMode>
  </BrowserRouter>,
);
