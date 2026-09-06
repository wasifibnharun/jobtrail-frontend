import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App.tsx";
import "./index.css";
import { applyTheme, getInitialTheme } from "./theme/theme";

applyTheme(getInitialTheme());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#17211d",
            color: "#f4f8f6",
            border: "1px solid #34413b",
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
