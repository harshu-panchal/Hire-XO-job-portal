import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { useAuthStore } from "./store/useAuthStore.ts";
import { Toaster } from "sonner";

function AppWrapper() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    console.log("[HireXO] Frontend build version: employee-plan-razorpay-debug-1");
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  </StrictMode>
);
